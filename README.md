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

/\*\*

- @api {post} /login User Login
- @apiName LoginUser
- @apiGroup Authentication
-
- @apiDescription
  Authenticates a user and returns a JWT token upon successful login.

- **Endpoint:** `/login`
- **Method:** POST
- **Description:** Authenticate an existing user and obtain a JWT token.

#### Request Body

```json
{
  "username": "string", // Required. The user's unique username or email.
  "password": "string" // Required. The user's password.
}
```

#### Responses

- **200 OK**

  ```json
  {
    "token": "jwt_token_string",
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
    "error": "Missing or invalid credentials."
  }
  ```

- **401 Unauthorized**

  ```json
  {
    "error": "Invalid username or password."
  }
  ```

- **500 Internal Server Error**
  ```json
  {
    "error": "An unexpected error occurred while logging in."
  }
  ```

#### Example

**Request**

```bash
curl -X POST http://localhost:3000/login \
    -H "Content-Type: application/json" \
    -d '{
        "username": "johndoe",
        "password": "mypassword"
    }'
```

**Success Response**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "12345",
    "username": "johndoe",
    "email": "johndoe@example.com"
  }
}
```

- @apiBody {String} password The user's password.
-
- @apiSuccess {String} token JWT authentication token for accessing protected routes.
- @apiSuccess {Object} user Basic user information (e.g., id, username, email).
-
- @apiError (400) {String} error Missing or invalid credentials.
- @apiError (401) {String} error Authentication failed due to incorrect username or password.
-
- @apiExample {json} Request Example:
-     POST /login
-     {
-       "username": "johndoe",
-       "password": "mypassword"
-     }
-
- @apiSuccessExample {json} Success Response:
-     HTTP/1.1 200 OK
-     {
-       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
-       "user": {
-         "id": "12345",
-         "username": "johndoe",
-         "email": "johndoe@example.com"
-       }
-     }
-
- @apiErrorExample {json} Error Response:
-     HTTP/1.1 401 Unauthorized
-     {
-       "error": "Invalid username or password"
-     }

  ### 2. Login User

  - **Endpoint:** `/users/login`
  - **Method:** POST
  - **Description:** Authenticate an existing user and obtain a JWT token.

  #### Request Body

  ```json
  {
    "username": "string", // Required. The user's unique username or email.
    "password": "string" // Required. The user's password.
  }
  ```

  #### Responses

  - **200 OK**

    ```json
    {
      "token": "jwt_token_string",
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
      "error": "Missing or invalid credentials."
    }
    ```

  - **401 Unauthorized**

    ```json
    {
      "error": "Invalid username or password."
    }
    ```

  - **500 Internal Server Error**
    ```json
    {
      "error": "An unexpected error occurred while logging in."
    }
    ```

  #### Example

  **Request**

  ```bash
  curl -X POST http://localhost:3000/users/login \
      -H "Content-Type: application/json" \
      -d '{
          "username": "johndoe",
          "password": "mypassword"
      }'
  ```

  **Success Response**

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "12345",
      "username": "johndoe",
      "email": "johndoe@example.com"
    }
  }
  ```

  ### 3. Logout User

  - **Endpoint:** `/logout`
  - **Method:** GET
  - **Description:** Logs out the currently authenticated user by invalidating their session or token.

  #### Request Headers

  | Name          | Type   | Description                  |
  | ------------- | ------ | ---------------------------- |
  | Authorization | String | User's access token (Bearer) |

  #### Responses

  - **200 OK**

    ```json
    {
      "message": "Successfully logged out."
    }
    ```

  - **401 Unauthorized**

    ```json
    {
      "error": "Invalid or missing authentication token."
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "error": "An error occurred while processing the logout request."
    }
    ```

  #### Example

  **Request**

  /\*\*

  - Handles the process of refreshing an expired or soon-to-expire authentication token.
  -
  - This function typically sends a request to the authentication server using a refresh token,
  - retrieves a new access token, and updates the application's authentication state accordingly.
  - It ensures that the user remains authenticated without requiring them to log in again.
  -
  - Returns a promise that resolves when the token has been successfully refreshed,
  - or rejects if the refresh process fails (e.g., if the refresh token is invalid or expired).
  -
  - @returns {Promise<void>} A promise that resolves when the token refresh is complete.
    \*/
