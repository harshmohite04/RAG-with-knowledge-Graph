import requests
import time

BASE_URL = "http://localhost:8000"

def ingest(filename, case_id):
    print(f"Ingesting {filename} for {case_id}...")
    with open(f"documents/{filename}", "rb") as f:
        files = {"file": (filename, f, "text/plain")}
        data = {"caseId": case_id}
        res = requests.post(f"{BASE_URL}/ingest", files=files, data=data)
        print(f"Status: {res.status_code}, Response: {res.json()}")
        if res.status_code != 200:
            raise Exception("Ingestion failed")

def chat(message, case_id):
    print(f"Chatting with {case_id}: {message}")
    res = requests.post(f"{BASE_URL}/chat", json={"message": message, "caseId": case_id})
    if res.status_code != 200:
        print(f"Error: {res.text}")
        return None
    data = res.json()
    print(f"Answer: {data['answer']}")
    return data

def main():
    # 1. Ingest Data for Case A
    # Make sure case1.txt exists in documents/
    ingest("case1.txt", "case_A")
    
    # 2. Ingest Data for Case B (use sample1.txt which is different)
    ingest("sample1.txt", "case_B")
    
    time.sleep(2) # Allow async writes/indexing if any (though currently synchronous)

    # 3. Test Isolation
    print("\n--- TEST 1: Retrieve Case A info from Case A ---")
    res_a = chat("What is the name of the patient?", "case_A")
    if "Riya" in res_a["answer"]:
        print("PASS: Case A retrieved correct info.")
    else:
        print("FAIL: Case A did not retrieve correct info.")

    print("\n--- TEST 2: Retrieve Case A info from Case B ---")
    res_b = chat("What is the name of the patient?", "case_B")
    if "Riya" not in res_b["answer"]:
        print("PASS: Case B did NOT retrieve Case A info (Good isolation).")
    else:
        print("FAIL: Case B Leaked info from Case A!")

    # 4. Test Memory in Case A
    print("\n--- TEST 3: Memory in Case A ---")
    chat("My name is Tester.", "case_A")
    res_mem = chat("What is my name?", "case_A")
    if "Tester" in res_mem["answer"]:
         print("PASS: Memory working in Case A.")
    else:
         print("FAIL: Memory failed in Case A.")

    print("\n--- TEST 4: Memory Isolation (Case B should not know name) ---")
    res_mem_b = chat("What is my name?", "case_B")
    if "Tester" not in res_mem_b["answer"]:
         print("PASS: Case B does not know user name from Case A.")
    else:
         print("FAIL: Memory leaked to Case B.")

if __name__ == "__main__":
    main()
