import os
import requests

# Defaults for local Ollama
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")

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
