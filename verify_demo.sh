#!/bin/bash
echo "Testing /chat endpoint..."
curl -X POST "http://localhost:8000/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "What is the hospital name?", "top_k": 1}' \
     | grep "sample1.txt" && echo "\n[SUCCESS] Source found in response" || echo "\n[FAILURE] Source NOT found"

echo "\nTesting /files endpoint..."
curl -I "http://localhost:8000/files/sample1.txt" \
     | grep "200 OK" && echo "[SUCCESS] File is accessible" || echo "[FAILURE] File NOT accessible"
