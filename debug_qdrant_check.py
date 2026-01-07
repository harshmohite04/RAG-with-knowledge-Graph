try:
    from qdrant_client import QdrantClient
    print(f"QdrantClient imported successfully. Version: {getattr(QdrantClient, '__version__', 'unknown')}")
    client = QdrantClient("http://localhost:6333")
    print("Attributes of QdrantClient:")
    for attr in dir(client):
        if "query" in attr or "search" in attr:
            print(f" - {attr}")
            
    print(f"\nHas query_points? {'query_points' in dir(client)}")
except ImportError:
    print("Could not import qdrant_client")
except Exception as e:
    print(f"Error: {e}")

try:
    import neo4j_graphrag
    print(f"\nNeo4j GraphRAG imported. Version: {getattr(neo4j_graphrag, '__version__', 'unknown')}")
    print(f"Location: {neo4j_graphrag.__file__}")
except ImportError:
    print("\nCould not import neo4j_graphrag")
