# API Curl Commands

Use these commands to test the API endpoints.
**Replace** placeholders like `{{TOKEN}}`, `{{CASE_ID}}`, `{{USER_ID}}` with actual values returned from previous requests.

## 1. Authentication

### Sign Up

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Lawyer",
    "email": "lawyer@test.com",
    "phone": "1234567890",
    "password": "password123",
    "role": "Lawyer"
  }'
```

**Expected Response in `api/auth/signup`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1b2c3e4b0d5c6a7e8f901",
    "email": "lawyer@test.com",
    "role": "Lawyer",
    "name": "Test Lawyer"
  }
}
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

**Expected Response in `api/auth/login`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1b2c3e4b0d5c6a7e8f901",
    "email": "lawyer@test.com",
    "role": "Lawyer",
    "name": "Test Lawyer"
  }
}
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

**Expected Response:**

```json
{
  "id": "64f1b2c3e4b0d5c6a7e8f901",
  "firstName": "Test",
  "lastName": "Lawyer",
  "email": "lawyer@test.com",
  "phone": "1234567890",
  "role": "Lawyer"
}
```

### Update My Profile

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

**Expected Response:**

```json
{
  "id": "64f1b2c3e4b0d5c6a7e8f901",
  "firstName": "Updated",
  "lastName": "Name",
  "email": "lawyer@test.com",
  "phone": "1234567890",
  "role": "Lawyer"
}
```

### Search Users

```bash
curl -X GET "http://localhost:3000/api/users/search?email=lawyer" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
[
  {
    "_id": "64f1b2c3e4b0d5c6a7e8f901",
    "name": "Test Lawyer",
    "email": "lawyer@test.com",
    "role": "Lawyer",
    "avatar": "..."
  }
]
```

---

## 3. Cases

### Get All Cases (Dashboard)

```bash
curl -X GET "http://localhost:3000/api/cases?status=Open" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
[
  {
    "_id": "64f1c500e4b0d5c6a7e8f902",
    "title": "Doe v. Smith",
    "clientName": "John Doe",
    "status": "Open",
    "createdAt": "2023-09-01T10:00:00.000Z"
  }
]
```

### Create Case (Internal Multipart with Files)

_Requires `case-docs.pdf` and `contract.docx` in current directory._

```bash
curl -X POST http://localhost:3000/api/cases \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Estate Planning" \
  -F "clientName=Jane Doe" \
  -F "legalMatter=Estate" \
  -F "description=Will and Trust setup" \
  -F "assignedTeam=[{\"user\":\"{{USER_ID}}\",\"role\":\"Associate\"}]" \
  -F "documents=@case-docs.pdf" \
  -F "documents=@contract.docx"
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

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f1c500e4b0d5c6a7e8f902",
    "title": "Doe v. Smith",
    "clientName": "John Doe",
    "legalMatter": "Litigation",
    "description": "Property dispute case.",
    "status": "Open",
    "assignedTeam": [
      {
        "user": "64f1b2c3e4b0d5c6a7e8f901",
        "role": "Paralegal",
        "_id": "64f1c500e4b0d5c6a7e8f903"
      }
    ],
    "documents": [],
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-01T10:00:00.000Z"
  }
}
```

### Get Single Case

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}} \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
{
  "_id": "64f1c500e4b0d5c6a7e8f902",
  "title": "Doe v. Smith",
  "clientName": "John Doe",
  "legalMatter": "Litigation",
  "description": "Property dispute case.",
  "status": "Open",
  "assignedTeam": [
    {
      "user": {
        "_id": "64f1b2c3e4b0d5c6a7e8f901",
        "name": "Test Lawyer",
        "email": "lawyer@test.com",
        "avatar": "..."
      },
      "role": "Paralegal",
      "_id": "64f1c500e4b0d5c6a7e8f903"
    }
  ],
  "documents": [],
  "createdAt": "2023-09-01T10:00:00.000Z",
  "updatedAt": "2023-09-01T10:00:00.000Z"
}
```

### Update Case

```bash
curl -X PUT http://localhost:3000/api/cases/{{CASE_ID}} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress",
    "description": "Updated case description.",
    "assignedTeam": [
      {
        "user": "{{USER_ID}}",
        "role": "Lead Attorney"
      }
    ],
    "notifications": {
      "email": true,
      "sms": true
    }
    }'
```

**Expected Response:**

```json
{
  "_id": "64f1c500e4b0d5c6a7e8f902",
  "title": "Doe v. Smith",
  "status": "In Progress",
  "description": "Updated case description.",
  ... // Other fields
}
```

### Delete Case

```bash
curl -X DELETE http://localhost:3000/api/cases/{{CASE_ID}} \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
{
  "success": true,
  "data": {}
}
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

**Expected Response:**

```json
{
  "_id": "64f1c500e4b0d5c6a7e8f902",
  "assignedTeam": [
    ... // previous members
    {
      "user": "64f1b2c3e4b0d5c6a7e8f905",
      "role": "Paralegal",
      "_id": "64f1c600e4b0d5c6a7e8f906"
    }
  ],
  ...
}
```

### Remove Team Member

```bash
curl -X DELETE http://localhost:3000/api/cases/{{CASE_ID}}/team/{{USER_ID}} \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
{
  "_id": "64f1c500e4b0d5c6a7e8f902",
  "assignedTeam": [ ... ], // Member removed
  ...
}
```

---

## 5. Case Documents

### Get Documents

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}}/documents \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
[
  {
    "name": "evidence.txt",
    "url": "/uploads/evidence-1693564800000.txt",
    "type": "text/plain",
    "size": 1024,
    "uploadedAt": "2023-09-01T12:00:00.000Z",
    "_id": "64f1c700e4b0d5c6a7e8f907"
  }
]
```

### Upload Document

```bash
curl -X POST http://localhost:3000/api/cases/{{CASE_ID}}/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@evidence.txt" \
  -F "category=Evidence"
```

**Expected Response:**

```json
{
  "name": "evidence.txt",
  "url": "/uploads/evidence-1693564800000.txt",
  "type": "text/plain",
  "size": 1024,
  "uploadedAt": "2023-09-01T12:00:00.000Z",
  "_id": "64f1c700e4b0d5c6a7e8f907"
}
```

---

## 6. Case Activities

### Get Activities

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}}/activities \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
[
  {
    "id": "64f1c800e4b0d5c6a7e8f908",
    "type": "note_added",
    "title": "Client Call",
    "description": "Discussed strategy.",
    "actor": {
      "name": "Test Lawyer",
      "avatar": "..."
    },
    "timestamp": "2023-09-01T13:00:00.000Z"
  }
]
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

**Expected Response:**

```json
{
  "caseId": "64f1c500e4b0d5c6a7e8f902",
  "title": "Client Call",
  "description": "Discussed strategy.",
  "type": "call_log",
  "actor": "64f1b2c3e4b0d5c6a7e8f901",
  "_id": "64f1c800e4b0d5c6a7e8f908",
  "createdAt": "2023-09-01T13:00:00.000Z",
  "updatedAt": "2023-09-01T13:00:00.000Z"
}
```

---

## 7. Case Messages (Chat)

### Get Messages

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}}/messages \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
[
  {
    "id": "64f1c900e4b0d5c6a7e8f909",
    "sender": "Test Lawyer",
    "senderId": "64f1b2c3e4b0d5c6a7e8f901",
    "content": "Hello team, please review the latest doc.",
    "time": "2023-09-01T14:00:00.000Z",
    "attachments": []
  }
]
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

**Expected Response:**

```json
{
  "id": "64f1c900e4b0d5c6a7e8f909",
  "sender": "Test Lawyer",
  "senderId": "64f1b2c3e4b0d5c6a7e8f901",
  "content": "Hello team, please review the latest doc.",
  "time": "2023-09-01T14:00:00.000Z",
  "attachments": []
}
```

---

## 8. Billing & Expenses

### Get Billing History

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}}/billing \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
[
  {
    "id": "64f1ca00e4b0d5c6a7e8f910",
    "date": "2023-09-01",
    "description": "Flight for deposition",
    "amount": 450.0,
    "status": "Pending",
    "category": "Travel"
  }
]
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

**Expected Response:**

```json
{
  "caseId": "64f1c500e4b0d5c6a7e8f902",
  "category": "Travel",
  "description": "Flight for deposition",
  "amount": 450.0,
  "date": "2023-09-01T15:00:00.000Z",
  "status": "Pending",
  "_id": "64f1ca00e4b0d5c6a7e8f910",
  "__v": 0
}
```

---

## 9. Calendar

### Get Events

```bash
curl -X GET http://localhost:3000/api/calendar \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
[
  {
    "_id": "64f1cb00e4b0d5c6a7e8f911",
    "title": "Court Hearing",
    "date": "2025-10-15T00:00:00.000Z",
    "type": "Court",
    "case": {
      "title": "Doe v. Smith"
    },
    "participants": []
  }
]
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

**Expected Response:**

```json
{
  "user": "64f1b2c3e4b0d5c6a7e8f901",
  "title": "Court Hearing",
  "date": "2025-10-15T00:00:00.000Z",
  "type": "Court",
  "case": "64f1c500e4b0d5c6a7e8f902",
  "_id": "64f1cb00e4b0d5c6a7e8f911",
  "participants": [],
  "__v": 0
}
```

---

## 10. Global Chats

### Get Conversations

```bash
curl -X GET http://localhost:3000/api/chats \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
[
  {
    "id": "64f1cc00e4b0d5c6a7e8f912",
    "name": "General Chat",
    "type": "group",
    "participants": [ ... ],
    "lastMessage": { ... }
  }
]
```
