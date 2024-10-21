## Pet Management API with User Registration, Email Verification, and JWT Authentication

This is a Node.js API built with Express.js and MongoDB, allowing users to register, log in, and manage pet details. It includes email verification during registration and uses JWT for user authentication upon login. The API leverages Mailtrap as a fake SMTP server for testing email functionality.

### Author : Badmavasan KIROUCHENASSAMY 

**/!\ .env file added (forbidden practice but added for you to have an idea of the format and to know what must be replaced)**

### Features
- User registration with pet details.
- Email verification for account activation.
- JWT-based authentication for login.
- Pet information returned after successful login.
- Verification email sent via Mailtrap (to simulate real email delivery).
- MongoDB for storing user and pet details.

### Prerequisites
- Node.js installed on your machine.
- MongoDB database (can be local or cloud-based e.g. MongoDB Atlas).
- Mailtrap account for email verification simulation.

### Setup Instructions

1. Clone the repository:
```bash 
git clone https://github.com/Badmavasan/amara-infinites-backend-web-dev-assignment.git
cd amara-infinites-backend-web-dev-assignment
```

2. Install dependencies:

```bash
npm install
```

3. Configure the environment variables:

- Create a .env file in the root directory and add the following:

```
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.mailtrap.io
EMAIL_HOST_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASS=your_mailtrap_password
```
- You'll need to create an account on Mailtrap to get the EMAIL_USER and EMAIL_PASS values. Mailtrap is a fake SMTP server that will capture the emails sent by the application for verification purposes.

4. Start the server:

```bash
npm start
```

5. Access the API:

The API will run on `http://localhost:5000` by default. You can test the API using Postman, cURL, or other HTTP clients.

### Usage

1. Register a New User

During registration, the user provides pet information and their own details. An email is sent to verify the account.

1. Endpoint: POST /auth/register 

    **Example Request (Postman):**

    ```json 
    {
    "petName": "Buddy",
    "petAge": 3,
    "mobileNumber": "+12345678901",
    "email": "buddy.owner@example.com",
    "username": "buddyOwner123",
    "password": "strongPassword123"
    }
    ```
    
    **Example cURL:**

    ```bash 
    curl -X POST http://localhost:5000/auth/register \
    -H "Content-Type: application/json" \
    -d '{
    "petName": "Buddy",
    "petAge": 3,
    "mobileNumber": "+12345678901",
    "email": "buddy.owner@example.com",
    "username": "buddyOwner123",
    "password": "strongPassword123"
    }'
    ```

    Response if There no no problem occurred during registration :

    ```json
    {
    "message": "User registered. Please verify your email"
    }
    ```

2. Email Verification

After registration, an email is sent to the user's email address with a verification token. Since Mailtrap is being used, the email won't actually be delivered but will be available on the Mailtrap platform.

**Example Request (Postman):**

**Endpoint: GET /auth/verify/:token**

**Replace :token with the actual verification token from the email captured in Mailtrap.**
     
**Example cURL:**

```bash
curl -X GET http://localhost:5000/auth/verify/<verification_token>
```

It is also possible to get the token from the mongo db token

Response:

```bash
{
"message": "Email verified successfully"
}
```

### User Login

After successful email verification, users can log in to receive a JWT token and access their pet information.

**Example Request (Postman):**

**Endpoint: POST /auth/login**

```json
{
"username": "buddyOwner123",
"password": "strongPassword123"
}
```

**Example cURL:**

```bash
curl -X POST http://localhost:5000/auth/login \
-H "Content-Type: application/json" \
-d '{
"username": "buddyOwner123",
"password": "strongPassword123"
}'
```


Response:

```json
{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"petDetails": {
"petName": "Buddy",
"petAge": 3,
"mobileNumber": "+12345678901"
}
}
```

### Email Verification with Mailtrap
- After registering a new user, the email won't actually be sent to the user's email address. Instead, it will be captured by Mailtrap. You can log into your Mailtrap account and view the email under your inbox, where you can find the verification token.
- Once you have the token, you can make a request to the /auth/verify/:token endpoint to verify the user.

### JWT Authentication

Once the user is logged in, the server returns a JWT token. This token must be included in the Authorization header for any requests to protected routes.

Example:

```bash
Authorization: Bearer <your-jwt-token>
```

### Notes on Email Verification

- Since this is a local environment with no real SMTP server, the verification emails are captured by Mailtrap. You can use the token from Mailtrap to verify your email.
- This is done for simplicity as using a mobile verification service like Twilio would require setting up paid third-party services. Email verification provides a seamless process since users won't have to check their mobile devices.

### Possible Improvements

- Automated Tests: While no tests are currently implemented, adding automated tests using Playwright or Cypress for end-to-end testing is possible.
### Running Locally with Mailtrap and MongoDB

When you clone and run the app locally using npm start, it will by default use the Mailtrap account and MongoDB configuration defined in the .env file. You can change these to your own Mailtrap and MongoDB credentials if needed.
**Example .env file:**

```
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.mailtrap.io
EMAIL_HOST_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASS=your_mailtrap_password
```

You can easily modify the project to use your own Mailtrap and MongoDB configuration.