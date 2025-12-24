# API Curl Commands

Use these commands to test the endpoints. Replace variables like `{{TOKEN}}` and `{{CASE_ID}}` with actual values from responses.

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

_Response will contain a `token`. Export it for subsequent requests:_
`export TOKEN="your_jwt_token"`

## 2. User & Profile

### Get Profile

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Search Users

```bash
curl -X GET "http://localhost:3000/api/users/search?email=lawyer" \
  -H "Authorization: Bearer $TOKEN"
```

## 3. Case Management

### Create Case

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
    "assignedTeam": "[{\"user\":\"UserId_Here\",\"role\":\"Paralegal\"}]"
  }'
```

_Start with empty team if you don't have other User IDs yet._

### Get All Cases (Dashboard)

```bash
curl -X GET "http://localhost:3000/api/cases?status=Open" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Single Case

```bash
# Export CASE_ID from previous response
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}} \
  -H "Authorization: Bearer $TOKEN"
```

### Update Case

```bash
curl -X PUT http://localhost:3000/api/cases/{{CASE_ID}} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description for the case."
  }'
```

## 4. Calendar

### Create Event

```bash
curl -X POST http://localhost:3000/api/calendar \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Initial Hearing",
    "date": "2025-12-30",
    "time": "09:00",
    "type": "Court",
    "caseId": "{{CASE_ID}}"
  }'
```

### Get Events

```bash
curl -X GET http://localhost:3000/api/calendar \
  -H "Authorization: Bearer $TOKEN"
```

## 5. Activities

### Add Activity

```bash
curl -X POST http://localhost:3000/api/cases/{{CASE_ID}}/activities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Client Meeting",
    "description": "Discussed settlement options.",
    "type": "note_added"
  }'
```

### Get Activities

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}}/activities \
  -H "Authorization: Bearer $TOKEN"
```

## 6. Case Messages (Chat)

### Send Message

```bash
curl -X POST http://localhost:3000/api/cases/{{CASE_ID}}/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Drafting the initial motion now."
  }'
```

### Get Messages

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}}/messages \
  -H "Authorization: Bearer $TOKEN"
```

## 7. Billing

### Add Expense

```bash
curl -X POST http://localhost:3000/api/cases/{{CASE_ID}}/billing \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Travel",
    "description": "Taxi to court",
    "amount": 45.50
  }'
```

### Get Billing History

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}}/billing \
  -H "Authorization: Bearer $TOKEN"
```

## 8. Documents

### Upload Document

_Note: Requires a file named `test.txt` in current directory_

```bash
curl -X POST http://localhost:3000/api/cases/{{CASE_ID}}/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.txt" \
  -F "category=Evidence"
```

### Get Documents

```bash
curl -X GET http://localhost:3000/api/cases/{{CASE_ID}}/documents \
  -H "Authorization: Bearer $TOKEN"
```
