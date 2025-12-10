from qdrant_client import models
import uuid

def qdrant_upsert(client, collection, vectors, payloads):
    vector_dim = len(vectors[0])

    # Create collection if it does not exist
    try:
        client.get_collection(collection)
    except:
        client.create_collection(
            collection_name=collection,
            vectors_config=models.VectorParams(
                size=vector_dim,
                distance=models.Distance.COSINE
            )
        )

    # Insert all points
    client.upsert(
        collection_name=collection,
        points=[
            models.PointStruct(
                id=str(uuid.uuid4()),
                vector=vectors[i],
                payload=payloads[i]
            )
            for i in range(len(vectors))
        ]
    )
