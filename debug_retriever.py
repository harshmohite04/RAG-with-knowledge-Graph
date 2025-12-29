from neo4j_graphrag.retrievers.external.qdrant.qdrant import QdrantNeo4jRetriever
import inspect

print("Help for QdrantNeo4jRetriever.search:")
print(help(QdrantNeo4jRetriever.search))

print("\nSignature:")
print(inspect.signature(QdrantNeo4jRetriever.search))
