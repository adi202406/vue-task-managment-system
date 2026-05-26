# Todo List API Documentation

Base API documentation for Todo List application using Laravel API + Sanctum SPA Authentication (HTTP Only Cookies).

---

# Base URL

```bash
http://127.0.0.1:8000/api
```

---

# Authentication

Authentication uses Laravel Sanctum with HTTP Only Cookies.

## Authentication Flow

### 1. Get CSRF Cookie

```http
GET /sanctum/csrf-cookie
```

This endpoint must be called before login.

---

### 2. Login

```http
POST /auth/login
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Success Response

```json
{
  "message": "Login success",
  "user": {
    "id": 1,
    "name": "Adi Ramadhan",
    "email": "user@example.com"
  }
}
```

---

### 3. Authenticated Request

Browser automatically sends session cookie.

No Bearer Token required.

---

### 4. Logout

```http
POST /auth/logout
```

---

# Headers

```http
Accept: application/json
Content-Type: application/json
```

---

# Frontend Configuration

## Axios Example

```js
import axios from 'axios'

axios.defaults.withCredentials = true

await axios.get('/sanctum/csrf-cookie')

await axios.post('/api/auth/login', {
  email,
  password,
})
```

---

# Authentication Endpoints

## Register

```http
POST /auth/register
```

### Request Body

```json
{
  "name": "test",
  "email": "test@gmail.com",
  "password": "password",
  "password_confirmation": "password"
}
```

---

## Login

```http
POST /auth/login
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

---

## Logout

```http
POST /auth/logout
```

🔒 Requires Authentication

---

# Password Reset

## Forgot Password

```http
POST /forgot-password
```

### Request Body

```json
{
  "email": "user@example.com"
}
```

---

## Reset Password

```http
POST /reset-password
```

### Request Body

```json
{
  "token": "reset_token",
  "email": "user@example.com",
  "password": "new_password",
  "password_confirmation": "new_password"
}
```

---

# Email Verification

## Send Verification Email

```http
POST /email/verification-notification
```

🔒 Requires Authentication

---

## Verify Email

```http
POST /email/verify/{id}/{hash}
```

---

## Resend Verification Email

```http
POST /email/resend
```

🔒 Requires Authentication

---

# Profile

## Get Profile

```http
POST /auth/profile
```

🔒 Requires Authentication

---

## Update Profile

```http
PUT /auth/profile
```

### Form Data

| Field | Type |
|---|---|
| name | string |
| email | string |
| avatar | file |

🔒 Requires Authentication

---

## Update Password

```http
PUT /auth/profile/password
```

### Request Body

```json
{
  "current_password": "password",
  "new_password": "new_password",
  "new_password_confirmation": "new_password"
}
```

🔒 Requires Authentication

---

# Workspaces

## Create Workspace

```http
POST /workspaces
```

### Request Body

```json
{
  "title": "Workspace Name",
  "visibility": "private",
  "description": ""
}
```

🔒 Requires Authentication

---

## Get All Workspaces

```http
GET /workspaces
```

🔒 Requires Authentication

---

## Get Single Workspace

```http
GET /workspaces/{slug}
```

🔒 Requires Authentication

---

## Update Workspace

```http
PUT /workspaces/{id}
```

### Request Body

```json
{
  "title": "Updated Workspace",
  "visibility": "private",
  "description": "Workspace description"
}
```

🔒 Requires Authentication

---

## Delete Workspace

```http
DELETE /workspaces/{id}
```

🔒 Requires Authentication

---

# Workspace Members

## Invite User to Workspace

```http
POST /workspaces/{workspace_id}/invite
```

### Request Body

```json
{
  "email": "user@example.com",
  "role": "editor"
}
```

🔒 Requires Authentication

---

## Accept Workspace Invitation

```http
PATCH /workspaces/{workspace_id}/accept-invitation
```

🔒 Requires Authentication

---

## Remove User From Workspace

```http
DELETE /workspaces/{workspace_id}/users
```

### Request Body

```json
{
  "user_id": 1
}
```

🔒 Requires Authentication

---

# Boards

## Create Board

```http
POST /workspaces/{workspace_slug}/boards
```

### Request Body

```json
{
  "name": "To Do List",
  "color": "#3b82f6",
  "is_favorite": true,
  "position": 1
}
```

🔒 Requires Authentication

---

## Get All Boards

```http
GET /workspaces/{workspace_slug}/boards
```

🔒 Requires Authentication

---

## Get Single Board

```http
GET /workspaces/{workspace_slug}/boards/{id}
```

🔒 Requires Authentication

---

## Update Board

```http
PUT /workspaces/{workspace_slug}/boards/{id}
```

### Request Body

```json
{
  "name": "Updated Board",
  "position": 1
}
```

🔒 Requires Authentication

---

## Reorder Board Position

```http
PATCH /workspaces/{workspace_slug}/boards/{id}/reorder
```

### Request Body

```json
{
  "position": 0
}
```

🔒 Requires Authentication

---

## Toggle Favorite Board

```http
PATCH /workspaces/{workspace_slug}/boards/{id}/toggle-favorite
```

🔒 Requires Authentication

---

## Delete Board

```http
DELETE /workspaces/{workspace_slug}/boards/{id}
```

🔒 Requires Authentication

---

# Cards

## Get Cards by Board

```http
GET /boards/{board_id}/cards
```

🔒 Requires Authentication

---

# Comments

## Create Comment

```http
POST /cards/{card_id}/comments
```

### Request Body

```json
{
  "content": "This is a comment"
}
```

🔒 Requires Authentication

---

## Get Comments

```http
GET /cards/{card_id}/comments
```

🔒 Requires Authentication

---

## Update Comment

```http
PUT /comments/{id}
```

### Request Body

```json
{
  "content": "Updated comment"
}
```

🔒 Requires Authentication

---

## Delete Comment

```http
DELETE /comments/{id}
```

🔒 Requires Authentication

---

# Reminders

## Create Reminder

```http
POST /cards/{card_id}/reminders
```

### Request Body

```json
{
  "remind_at": "2025-05-16 19:31:00",
  "channel": "email"
}
```

Available channels:

- email
- in_app

🔒 Requires Authentication

---

## Update Reminder

```http
PUT /reminders/{id}
```

### Request Body

```json
{
  "remind_at": "2025-05-21 18:27:00",
  "channel": "in_app"
}
```

🔒 Requires Authentication

---

## Get Single Reminder

```http
GET /reminders/{id}
```

🔒 Requires Authentication

---

## Delete Reminder

```http
DELETE /reminders/{id}
```

🔒 Requires Authentication

---

## Process Reminder Notification

```http
POST /reminders/process
```

🔒 Requires Authentication

---

# Response Format

## Success Response

```json
{
  "success": true,
  "message": "Request success",
  "data": {}
}
```

---

## Validation Error Response

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field is required."
    ]
  }
}
```

---

## Unauthorized Response

```json
{
  "message": "Unauthenticated."
}
```

---

# HTTP Status Codes

| Code | Description |
|---|---|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# Notes

- All protected endpoints require authenticated session.
- Browser must support cookies.
- Frontend must enable `withCredentials`.
- API uses Laravel Sanctum SPA Authentication.
- Authentication token is stored using HTTP Only Cookies.