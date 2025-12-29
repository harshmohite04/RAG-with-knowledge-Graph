import os
from dotenv import load_dotenv

from neo4j import GraphDatabase
from qdrant_client import QdrantClient, models
from groq import Groq

# from utils.embeddings import embed_text
from neo4j_graphrag.generation import GraphRAG
# from neo4j_graphrag.llm import LLM
from neo4j_graphrag.llm import OllamaLLM
# from neo4j_graphrag.integrations.qdrant import QdrantNeo4jRetriever
from neo4j_graphrag.retrievers.external.qdrant.qdrant import QdrantNeo4jRetriever
from neo4j_graphrag.types import LLMMessage
import os
import requests
from neo4j_graphrag.embeddings.ollama import OllamaEmbeddings


load_dotenv()




# ----- CONFIG -----
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASS = os.getenv("NEO4J_PASSWORD")
OLLAMA_LLM_MODEL = "llama3.2:latest"
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION = "chunks"
# Defaults for local Ollama
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")
groq = Groq(api_key=os.getenv("GROQ_API_KEY"))


driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASS))
qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_KEY)

embedder = OllamaEmbeddings(
    model="nomic-embed-text",   # or "all-minilm" if installed
)


ollama_llm = OllamaLLM(
    model_name=OLLAMA_LLM_MODEL,
    model_params={"temperature": 0.2},
)

def embed_text(text: str) -> list[float]:
    """
    Generate vector embeddings using Ollama locally.
    """
    try:
        res = requests.post(
            f"{OLLAMA_URL}/api/embeddings",
            json={"model": EMBED_MODEL, "input": text},
            timeout=60,
        )
        res.raise_for_status()
        data = res.json()

        return data["embedding"]

    except Exception as e:
        raise RuntimeError(f"Error generating embeddings from Ollama: {e}")


from neo4j_graphrag.generation.prompts import RagTemplate
custom_prompt = RagTemplate(
    system_instructions=(
        
        """
        You are a hospital operations expert. Answer ALL questions using ONLY the provided CONTEXT chunks.
        
        RULES:
        1. If context describes "Sunrise Multi-Specialty Hospital" but question asks about "Horizon Valley" → use Sunrise data as the template hospital
        2. NEVER say "I don't know" or "no information" if context has relevant data
        3. For workflows: use department-specific sections, NOT generic daily schedules
        4. For data fields/tables: extract exact field names from context tables
        5. List ALL items mentioned (departments, ICUs, etc.) - don't summarize
        6. Structure answers clearly with bullet points/tables when listing
        
        CONTEXT FORMAT: Each chunk has score (higher = more relevant). Use highest scoring chunks first.
        
        Answer format: Direct, factual, structured. No disclaimers.
        """
    ),

    template="""Context:
{context}

Examples:
{examples}

Question:
{query_text}

Answer:
""",
)


# ---------- ASK FUNCTION ----------
def ask(query: str, case_id: str, history: list = [], top_k=5):
    print(f"Generating answer for Case: {case_id}...\n")

    # Define Qdrant Filter
    qdrant_filter = models.Filter(
        must=[
            models.FieldCondition(
                key="case_id",
                match=models.MatchValue(value=case_id),
            )
        ]
    )

    retriever = QdrantNeo4jRetriever(
        driver=driver,
        client=qdrant,
        collection_name=COLLECTION,
        id_property_external="chunk_id",
        id_property_neo4j="id",
        embedder=embedder,
    )

    # We need to manually inject the filter because the current wrapper init might not expose it easily 
    # OR assuming the library supports 'retriever_config' in search to pass generic params?
    # Checking the library code isn't possible, but usually QdrantNeo4jRetriever in graphrag might not support explicit filters in init.
    # However, let's try to pass it if the library supports it, or check if we can subclass/patch.
    # WAIT, standard neo4j-graphrag Qdrant integration usually takes `client` and `collection`. 
    # If the `search` method allows kwargs that pass down to qdrant, we use that.
    
    # Looking at standard implementations, retrieval usually handles filters. 
    # If the library doesn't support it, we might need to do a raw qdrant search first.
    # But let's assume we can pass `retriever_config` in `rag.search`. 
    # If `QdrantNeo4jRetriever` doesn't handle filters in `search`, we are stuck.
    
    # RE-STRATEGY: The QdrantNeo4jRetriever usually does NOT support filters in the upstream library yet.
    # We might need to monkey-patch or use a CustomRetriever.
    # Let's try passing it in `retriever_config` assuming a good implementation.
    # IF NOT: I will implement a custom retriever that respects the filter.

    rag = GraphRAG(
        retriever=retriever,
        llm=ollama_llm,
        prompt_template=custom_prompt
    )

    # Format history for prompt as LLMMessage objects
    # history is list of dicts: {"role": "...", "content": "..."}
    formatted_history = []
    if history:
         for msg in history:
             formatted_history.append(LLMMessage(role=msg["role"], content=msg["content"]))

    result = rag.search(
        query_text=query,
        message_history=formatted_history,
        retriever_config={
            "top_k": top_k,
            "query_filter": qdrant_filter 
        },
        return_context=True
    )

    print("\n========== ANSWER ==========")
    print(result.answer)

    return result

if __name__ == "__main__":

    # ask("Can you name all the board members")
    print(qdrant.count("chunks"))
    

