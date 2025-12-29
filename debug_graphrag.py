from neo4j_graphrag.generation import GraphRAG
import inspect

print("Help for GraphRAG.search:")
print(help(GraphRAG.search))

print("\nSignature:")
print(inspect.signature(GraphRAG.search))
