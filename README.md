Live - https://origin-bluy-media-upload-using-aws.vercel.app

# Media Capture and Storage Web Application

## Project Overview

This project is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to upload, view, and manage media files (images and videos). The media files are stored securely using AWS S3 or in a backend folder with Multer. The application showcases backend skills, API handling, and AWS integration.

https://github.com/user-attachments/assets/69ca8a5c-71cd-41fc-a6f9-69843cf426a7

## Features

1. **User Authentication**:
   - User registration and login using JWT authentication.
   - Password hashing with bcrypt for security.
   - Token-based access to protected endpoints.

2. **Media Upload & Management**:
   - Upload images and videos from local storage.
   - Store media securely using AWS S3 or Multer.
   - Media gallery to view, delete, and manage uploaded media.
   - Filter media by type (images/videos).

3. **Backend API & Database**:
   - API endpoints for user authentication, media upload, retrieval, and deletion.
   - MongoDB for database storage with Mongoose ORM.
   - Store media metadata (filename, URL, upload date, user reference).

4. **UI/UX Design**:
   - React.js with Material-UI/Tailwind for a clean and responsive design.
   - Dashboard to view uploaded media in grid/list format.
   - Preview option before uploading media.

5. **State Management**:
   - Redux Toolkit or Context API for managing authentication and media state.

6. **AWS Integration**:
   - Configure AWS S3 bucket for media storage.
   - Use AWS SDK for secure upload and retrieval.
   - Proper IAM permissions for access control.

7. **Error Handling & Validation**:
   - Validate user input for authentication and file uploads.
   - Try-catch blocks for API error handling.
   - Success and error messages for user feedback.

8. **Deployment**:
   - Backend deployed using Render/Heroku/Vercel.
   - Frontend deployed using Vercel/Netlify.
   - MongoDB Atlas for cloud database storage.

## Tech Stack

- **Frontend**: React.js, Redux Toolkit/Context API, Material-UI/Tailwind
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Storage**: AWS S3 / Multer
- **Authentication**: JWT (bcrypt for password hashing)
- **Deployment**: Vercel/Netlify (Frontend), Render/Heroku (Backend), MongoDB Atlas

## Live Link

[Live Demo](https://origin-bluy-media-upload-using-aws.vercel.app/)

## GitHub Repository

[GitHub Repo](https://github.com/Rahul-verma28/OriginBluy-Media-upload-using-AWS)


## .env
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
AWS_BUCKET_NAME=<your_aws_bucket_name>


