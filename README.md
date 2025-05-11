# API Documentation

## User Endpoints

### 1. Register User

- **Endpoint:** `/users/register`
- **Method:** POST
- **Description:** Register a new user account.

#### Request Body

```json
{
  "username": "string", // Required. Unique username for the user.
  "email": "string", // Required. Valid email address.
  "password": "string" // Required. Password (minimum 6 characters).
}
```

#### Responses

- **201 Created**

  ```json
  {
    "message": "User registered successfully.",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```

- **400 Bad Request**

  ```json
  {
    "error": "Validation error message describing the issue (e.g., missing fields, invalid email, password too short, etc.)"
  }
  ```

- **409 Conflict**

  ```json
  {
    "error": "Username or email already exists."
  }
  ```

- **500 Internal Server Error**
  ```json
  {
    "error": "An unexpected error occurred while registering the user."
  }
  ```

#### Example

**Request**

```bash
curl -X POST http://localhost:3000/users/register \
    -H "Content-Type: application/json" \
    -d '{
        "username": "johndoe",
        "email": "john.doe@example.com",
        "password": "securepass123"
    }'
```

**Success Response**

```json
{
  "message": "User registered successfully.",
  "user": {
    "id": "usr_123456789",
    "username": "johndoe",
    "email": "john.doe@example.com"
  }
}
```
