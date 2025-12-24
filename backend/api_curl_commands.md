# API Curl Commands

Use these commands to test the API endpoints.
**Replace** placeholders like `{{TOKEN}}`, `{{CASE_ID}}`, `{{USER_ID}}` with actual values returned from previous requests.

## 1. Authentication

### Sign Up

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Lawyer",
    "email": "lawyer@test.com",
    "password": "password123",
    "role": "Lawyer"
  }'
```

### Sign In

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lawyer@test.com",
    "password": "password123"
  }'
```

> **Note:** Copy the `token` from the response and export it:
> `export TOKEN="your_jwt_token_here"`

---

## 2. Users

### Get My Profile

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Update My Profile

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Name",
    "bio": "Specializing in corporate law."
  }'
```

### Search Users

```bash
curl -X GET "http://localhost:3000/api/users/search?email=lawyer" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Cases

### Get All Cases (Dashboard)

```bash
curl -X GET "http://localhost:3000/api/cases?status=Open" \
  -H "Authorization: Bearer $TOKEN"
```

### Create Case (JSON Payload)

```bash
curl -X POST http://localhost:3000/api/cases \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Doe v. Smith",
    "clientName": "John Doe",
    "legalMatter": "Litigation",
    "description": "Property dispute case.",
    "status": "Open",
    "assignedTeam": "[{\"user\":\"{{USER_ID}}\",\"role\":\"Paralegal\"}]"
  }'
```

> **Note:** `assignedTeam` must be a JSON string here.

### Create Case (Internal Multipart with Files)

_Requires `case-docs.pdf` in current directory._

```bash
curl -X POST http://localhost:3000/api/cases \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Estate Planning" \
  -F "clientName=Jane Doe" \
  -F "legalMatter=Estate" \
  -F "description=Will and Trust setup" \
  -F "assignedTeam=[{\"user\":\"{{USER_ID}}\",\"role\":\"Associate\"}]" \
  -F "documents=@case-docs.pdf"
```

### Get Single Case

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}} \
  -H "Authorization: Bearer $TOKEN"
```

### Update Case

```bash
curl -X PUT http://localhost:3000/api/cases/{{CASE_ID}} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress",
    "description": "Updated case description."
  }'
```

### Delete Case

```bash
curl -X DELETE http://localhost:3000/api/cases/{{CASE_ID}} \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Case Team

### Add Team Member

```bash
curl -X POST http://localhost:3000/api/cases/{{CASE_ID}}/team \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "{{USER_ID}}",
    "role": "Paralegal"
  }'
```

### Remove Team Member

```bash
curl -X DELETE http://localhost:3000/api/cases/{{CASE_ID}}/team/{{USER_ID}} \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Case Documents

### Get Documents

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}}/documents \
  -H "Authorization: Bearer $TOKEN"
```

### Upload Document

_Requires `evidence.txt` in current directory._

```bash
curl -X POST http://localhost:3000/api/cases/{{CASE_ID}}/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@evidence.txt" \
  -F "category=Evidence"
```

---

## 6. Case Activities

### Get Activities

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}}/activities \
  -H "Authorization: Bearer $TOKEN"
```

### Add Activity

```bash
curl -X POST http://localhost:3000/api/cases/{{CASE_ID}}/activities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Client Call",
    "description": "Discussed strategy.",
    "type": "call_log"
  }'
```

---

## 7. Case Messages (Chat)

### Get Messages

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}}/messages \
  -H "Authorization: Bearer $TOKEN"
```

### Send Message

```bash
curl -X POST http://localhost:3000/api/cases/{{CASE_ID}}/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello team, please review the latest doc."
  }'
```

---

## 8. Billing & Expenses

### Get Billing History

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}}/billing \
  -H "Authorization: Bearer $TOKEN"
```

### Add Expense

```bash
curl -X POST http://localhost:3000/api/cases/{{CASE_ID}}/billing \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Travel",
    "description": "Flight for deposition",
    "amount": 450.00,
    "status": "Pending"
  }'
```

---

## 9. Calendar

### Get Events

```bash
curl -X GET http://localhost:3000/api/calendar \
  -H "Authorization: Bearer $TOKEN"
```

### Create Event

```bash
curl -X POST http://localhost:3000/api/calendar \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Court Hearing",
    "date": "2025-10-15",
    "time": "10:00",
    "type": "Court",
    "caseId": "{{CASE_ID}}"
  }'
```

---

## 10. Global Chats

### Get Conversations

```bash
curl -X GET http://localhost:3000/api/chats \
  -H "Authorization: Bearer $TOKEN"
```
