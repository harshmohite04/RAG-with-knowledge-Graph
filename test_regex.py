import re

content_str = "<Record node=<Node element_id='4:a837cde0-a97d-4c5e-bdb8-038686997772:79' labels=frozenset({'Chunk'}) properties={'id': '7edd4ba1-62b3-4323-a3f0-ad0813ab79fa', 'text': 'Comprehensive Hospital Operations & Management Guide\\nHospital Name: Sunrise Multi-Specialty Hospital\\nLocation: Pune, Maharashtra, India\\nEstablished: 2015\\nType: 350-bed Multi-specialty teaching hospital\\nNABH Accredited: Yes\\nHIPAA Compliant: Yes\\n________________________________________\\nExecutive Summary\\nSunrise Multi-Specialty Hospital is a state-of-the-art healthcare facility providing comprehensive medical services across 25+ departments. This document serves as the authoritative reference for hospital operations, patient management, data structures, regulatory compliance, and departmental workflows. All information is HIPAA-compliant and production-ready for integration into Electronic Medical Record (EMR) and Healthcare Information Systems.\\n________________________________________', 'source': 'sample1.txt'}> score=0.61399436>"

print(f"Original content length: {len(content_str)}")

# Regex from server.py
source = None
text_content = content_str 

source_match = re.search(r"['\"]source['\"]\s*:\s*['\"]([^'\"]+)['\"]", content_str)
if source_match:
    source = source_match.group(1)
    print(f"Found source: {source}")
else:
    print("Source NOT found")

text_match = re.search(r"['\"]text['\"]\s*:\s*['\"]((?:[^'\\]|\\.)*)['\"]", content_str)
if text_match:
    text_content = text_match.group(1).replace("\\n", "\n").replace("\\'", "'")
    print(f"Found text: {text_content[:50]}...")
else:
    print("Text NOT found")

if source == "sample1.txt" and "Sunrise" in text_content:
    print("SUCCESS: Regex extraction working.")
else:
    print("FAILURE: Regex extraction failed.")
