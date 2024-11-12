# E-Book API

This is a RESTful API for managing e-books, built using Node.js and TypeScript for type safety. This API allows users to register and log in, manage their collection of e-books, and upload e-books and photos. JWT authentication is implemented for secure access, and MongoDB is used as the database. The project follows best practices in Node.js and TypeScript for robust and maintainable code.

## Features

- **User Authentication**: Users can sign up and log in using JWT authentication.
- **E-Book Management**: Users can create, read, and manage their e-books.
- **File Upload**: Users can upload PDFs of their books and photos, which are stored on Cloudinary.
- **Secure Password Storage**: Passwords are securely hashed using `bcrypt`.
- **Type Safety**: The project is written in TypeScript to ensure type safety.
- **MongoDB Integration**: MongoDB is used as the database for storing user and book data.

## Tech Stack

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Minimal and flexible Node.js web application framework.
- **TypeScript**: Type-safe JavaScript.
- **MongoDB**: NoSQL database.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Cloudinary**: File storage for book PDFs and images.
- **Bcrypt**: For password hashing.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/cykoravish/E-book-API-Node-Js-Backend-.git
    cd E-book-API-Node-Js-Backend-
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following variables as described in .env.example file:

    ```plaintext
    PORT=3000
    MONGO_CONNECTION_STRING=
    NODE_ENV=development
    JWT_SECRET=
    CLOUDINARY_CLOUD=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    FRONTEND_DOMAIN=
    ```

4. Run the server:
    ```bash
    npm run dev
    ```

The server will start on `http://localhost:3000`.

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Register a new user
- **POST** `/api/auth/login` - Login a user and receive a JWT token

### Books

- **POST** `/api/books` - Create a new book (Requires authentication)
- **GET** `/api/books` - Retrieve all books
- **GET** `/api/books/:id` - Retrieve a specific book by its ID
- **PUT** `/api/books/:id` - Update a specific book (Requires authentication)
- **DELETE** `/api/books/:id` - Delete a specific book (Requires authentication)

### File Upload

- **POST** `/api/books/upload` - Upload a PDF or image for a book (Requires authentication)

## Libraries Used

- **Express**: For creating the server and handling routing.
- **Mongoose**: For connecting to and interacting with MongoDB.
- **Bcrypt**: For hashing user passwords securely.
- **Jsonwebtoken**: For implementing secure user authentication.
- **Cloudinary**: For handling file uploads (PDFs and images).
- **dotenv**: For managing environment variables.
- **TypeScript**: For type safety and improving code quality.

## Best Practices Followed

- **TypeScript**: Used to ensure type safety and improve code quality.
- **MVC Architecture**: The project is organized into models, controllers, and routes for better structure.
- **Error Handling**: Consistent error handling is implemented across the API.
- **Security**: Passwords are hashed, and JWT authentication is used to secure routes.

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
