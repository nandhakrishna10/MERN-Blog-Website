# MERN Blog Website

This is a full-stack blog website built using the MERN stack (MongoDB, Express, React, Node.js).

## Prerequisites

Ensure you have the following installed on your system:
- **Node.js** and **npm**: [Download and install Node.js](https://nodejs.org/).
- **MongoDB**: [Download and install MongoDB](https://www.mongodb.com/try/download/community).

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nandhakrishna10/MERN-Blog-Website.git
cd MERN-Blog-Website
```

### 2. Set Up the Backend (API)

Navigate to the `api` directory and install the necessary dependencies:

```bash
cd api
npm install
```

Create a `.env` file in the `api` directory and add the following content:

```
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

Replace `<your_mongodb_connection_string>` with your actual MongoDB connection string and `<your_jwt_secret>` with a secret key for JWT authentication.

Start the backend server:

```bash
npm start
```

### 3. Set Up the Frontend (Client)

Navigate to the `client` directory and install the necessary dependencies:

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory and add the following content:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend server:

```bash
npm start
```

### 4. Access the Application

Once both servers are running, you can access the application by opening [http://localhost:3000](http://localhost:3000) in your web browser.

## Directory Structure

- **api**: Contains the backend code using Express.js and MongoDB. It includes routes, controllers, and models for handling users, posts, and authentication.
- **client**: Contains the frontend code using React.js. It includes components, pages, and services to interact with the backend API.

## Notes

- Ensure MongoDB is running on your local machine or accessible through a cloud service like MongoDB Atlas.
- You can use tools like Postman to test the API endpoints.
- The application uses JWT for authentication, so ensure your secret key is secure.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
