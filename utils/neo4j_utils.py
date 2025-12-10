def create_chunk_node(driver, chunk_id, text, source):
    query = """
    MERGE (c:Chunk {id: $id})
    SET c.text = $text,
        c.source = $source
    """
    with driver.session() as s:
        s.run(query, id=chunk_id, text=text, source=source)


def create_entity_relations(driver, chunk_id, text):
    # Placeholder for entity extraction → can integrate Groq or OpenAI later
    return
