import sys
import pkg_resources

def check_package(name):
    try:
        version = pkg_resources.get_distribution(name).version
        print(f"{name}: {version}")
    except pkg_resources.DistributionNotFound:
        print(f"{name}: Not Found")

with open("version_info.txt", "w") as f:
    sys.stdout = f
    print(f"Python: {sys.version}")
    check_package("qdrant-client")
    check_package("neo4j-graphrag")
    
    try:
        from qdrant_client import QdrantClient
        client = QdrantClient(":memory:")
        print(f"Has query_points: {'query_points' in dir(client)}")
        print(f"Client dir: {dir(client)}")
    except Exception as e:
        print(f"Error importing QdrantClient: {e}")
