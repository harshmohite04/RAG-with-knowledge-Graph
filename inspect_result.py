import sys
import os
from rag.rag import ask
try:
    # Run a simple query
    result = ask("What is the hospital name?", top_k=1)
    
    # Inspect the first context item if available
    if result.retriever_result and result.retriever_result.items:
        first_item = result.retriever_result.items[0]
        print("\n--- INSPECTION ---")
        print(f"Type: {type(first_item)}")
        print(f"Dir: {dir(first_item)}")
        if hasattr(first_item, 'metadata'):
            print(f"Metadata: {first_item.metadata}")
        if hasattr(first_item, 'content'):
            print(f"Content Type: {type(first_item.content)}")
            print(f"Content: {first_item.content}")

    else:
        print("No results found to inspect.")
except Exception as e:
    print(f"Error: {e}")
