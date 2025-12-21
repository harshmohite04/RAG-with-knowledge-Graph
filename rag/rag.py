import os
from dotenv import load_dotenv

from neo4j import GraphDatabase
from qdrant_client import QdrantClient
from groq import Groq

# from utils.embeddings import embed_text
from neo4j_graphrag.generation import GraphRAG
# from neo4j_graphrag.llm import LLM
from neo4j_graphrag.llm import OllamaLLM
# from neo4j_graphrag.integrations.qdrant import QdrantNeo4jRetriever
from neo4j_graphrag.retrievers.external.qdrant.qdrant import QdrantNeo4jRetriever
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
def ask(query: str, top_k=5):
    print("Generating answer...\n")

    retriever = QdrantNeo4jRetriever(
        driver=driver,
        client=qdrant,
        collection_name=COLLECTION,
        id_property_external="chunk_id",
        id_property_neo4j="id",
        embedder= embedder
    )

    rag = GraphRAG(
        retriever=retriever,
        llm=ollama_llm,
        prompt_template=custom_prompt
        
    )


    result = rag.search(
        query_text=query,
        retriever_config={
            "top_k": top_k,
        },
        return_context=True

    )

    print("\n========== ANSWER ==========")
    print(result.answer)

    if result.retriever_result:
        print("\n========== CONTEXT =========")
        for item in result.retriever_result.items:
            print("-", item.content)

    print("Retriever items:", len(result.retriever_result.items))
    
    with open("log_file", "a", encoding="utf-8") as f:
        f.write("\n\n==============================\n")
        f.write(f"QUERY: {query}\n")
        f.write("==============================\n\n")

        f.write("ANSWER:\n")
        f.write(result.answer + "\n\n")

        f.write("CONTEXT:\n")
        if result.retriever_result:
            for item in result.retriever_result.items:
                f.write("- " + item.content + "\n")

        f.write(f"\nRetriever items: {len(result.retriever_result.items)}\n")
        f.write("=============================================\n\n")

    return result.answer

if __name__ == "__main__":

    # ask("Can you name all the board members")
    print(qdrant.count("chunks"))
    

