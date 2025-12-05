# Rastogi Drive - Google Drive based drive

A full-stack web application that mimics the functionality of Google Drive, allowing users to upload, view, download, and manage their files securely.

## Demo

![Demo GIF](demo.gif)

*Replace `demo.gif` with your actual demo GIF file showing the app in action.*

## Features

- **User Authentication**: Secure login and registration using JWT tokens and bcrypt for password hashing.
- **File Upload**: Upload files with support for various formats (images, documents, videos, etc.).
- **File Management**: View, download, and delete files from your personal drive.
- **Image Thumbnails**: Automatic thumbnail generation for uploaded images using Sharp.
- **Responsive UI**: Modern, responsive interface built with EJS, Tailwind CSS, and Flowbite.
- **Cloud Storage**: Files stored securely in Supabase Storage.
- **Database Integration**: User data managed with MongoDB and Mongoose.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript Templates), Tailwind CSS, Flowbite
- **Database**: MongoDB (via Mongoose)
- **File Storage**: Supabase Storage
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **File Handling**: Multer (for uploads), Sharp (for image processing)

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)
- A Supabase account (for file storage)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd google-drive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see Environment Setup section).

4. Start the application:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Environment Setup

Create a `.env` file in the root directory and add the following variables:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
MONGO_URI=your_mongodb_connection_string
```

### Supabase Setup

1. Create a new project on [Supabase](https://supabase.com/).
2. Go to Settings > API to get your project URL and anon key.
3. Create a new storage bucket named `files`.
4. Set up appropriate policies for file access (allow authenticated users to upload/download their own files).

### MongoDB Setup

1. Set up a MongoDB database (local or cloud).
2. Get your connection string and add it to the `MONGO_URI` environment variable.

## Usage

1. Register a new account or log in with existing credentials.
2. Upload files using the "Upload File" button.
3. View your uploaded files in the grid layout.
4. Click "View" to open files in a new tab, "Download" to save them, or "Delete" to remove them.
5. Access your profile and logout using the navigation links.

## Project Structure

```
google-drive/
├── app.js                 # Main application file
├── config/
│   ├── db.js             # Database connection
│   ├── supabaseClient.js # Supabase client configuration
│   └── files.model.js    # File model (if used)
├── middleware/
│   └── authe.middleware.js # Authentication middleware
├── model/
│   └── user.model.js     # User model
├── routes/
│   ├── index.routes.js   # Main routes (file operations)
│   └── user.routes.js    # User authentication routes
├── views/                # EJS templates
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── profile.ejs
│   └── index.ejs
├── uploads/              # Temporary upload directory
├── package.json
├── README.md
└── .env                  # Environment variables (create this)
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.com/) for cloud storage and real-time database
- [Tailwind CSS](https://tailwindcss.com/) and [Flowbite](https://flowbite.com/) for UI components
- [Sharp](https://sharp.pixelplumbing.com/) for image processing
