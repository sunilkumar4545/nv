# Photographer Portfolio - Dynamic Website

A dynamic photographer portfolio website built with Node.js, Express, MongoDB, and Cloudinary. Features an admin panel for easy image management.

## Features

- **Public Gallery**: Beautiful, responsive gallery with category filters and lightbox view
- **Admin Panel**: Secure admin interface for uploading and managing images
- **Multiple Upload Methods**: Upload images via file or URL
- **Image Categories**: Organize photos by category (wedding, portrait, landscape, etc.)
- **Image Orientation**: Categorize by orientation (portrait, landscape, square)
- **Cloud Storage**: All images stored securely on Cloudinary
- **Authentication**: Secure login system for admin access
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Black & White Theme**: Professional, modern UI design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (free tier available)

## Installation

1. **Clone the repository**
   ```bash
   cd photographer-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Update the `.env` file with your credentials:
   ```
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/photographer_portfolio

   # Cloudinary Configuration (get these from cloudinary.com)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Session Secret (change to a random string)
   SESSION_SECRET=your_session_secret_key_change_this

   # Server Configuration
   PORT=3000
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Initialize admin user**
   ```bash
   npm run init-admin
   ```

   This creates an admin account with:
   - Username: `niharika`
   - Password: `2006`

6. **Start the server**
   ```bash
   npm start
   ```

7. **Access the website**
   - Home: http://localhost:3000
   - Gallery: http://localhost:3000/gallery
   - Admin Login: http://localhost:3000/login

## Getting Cloudinary Credentials

1. Sign up for a free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Update these values in your `.env` file

## Admin Panel Usage

1. **Login**
   - Navigate to `/login`
   - Enter username: `niharika` and password: `2006`

2. **Upload Images**
   - Choose between file upload or URL upload
   - Fill in image details (title, category, orientation)
   - Add optional description
   - Click "Upload Image"

3. **Manage Images**
   - View all uploaded images
   - Filter by category or orientation
   - Delete images as needed

## Project Structure

```
photographer-portfolio/
├── config/
│   ├── database.js          # MongoDB connection configuration
│   └── cloudinary.js         # Cloudinary setup
├── models/
│   ├── Admin.js              # Admin user schema
│   └── Image.js              # Image metadata schema
├── routes/
│   ├── auth.js               # Authentication routes
│   └── images.js             # Image CRUD operations
├── middleware/
│   ├── auth.js               # Authentication middleware
│   └── upload.js             # Multer file upload configuration
├── utils/
│   └── initAdmin.js          # Admin initialization script
├── public/
│   ├── index.html            # Home page
│   ├── login.html            # Login page
│   ├── admin.html            # Admin panel
│   └── gallery.html          # Public gallery
├── server.js                 # Main Express server
├── package.json              # Project dependencies
└── .env                      # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Check authentication status

### Images
- `GET /api/images` - Get all images (supports category/orientation filters)
- `POST /api/images/upload-file` - Upload image from file (protected)
- `POST /api/images/upload-url` - Upload image from URL (protected)
- `DELETE /api/images/:id` - Delete image (protected)
- `GET /api/images/categories` - Get all categories

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Express-session with bcryptjs
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## Security Features

- Password hashing with bcryptjs
- Session-based authentication
- Protected admin routes
- File type validation
- File size limits (10MB max)

## Customization

### Change Admin Credentials
Edit `utils/initAdmin.js` and update the username/password, then run:
```bash
npm run init-admin
```

### Add More Categories
Update the category enum in `models/Image.js` and add corresponding options in the HTML forms.

### Modify Styles
Edit the `<style>` sections in the HTML files in the `public/` directory.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env`

### Cloudinary Upload Error
- Verify Cloudinary credentials in `.env`
- Check internet connection
- Ensure Cloudinary account is active

### Port Already in Use
- Change the `PORT` in `.env` file
- Or stop the process using port 3000

## License

This project is private and for personal use.

## Support

For issues or questions, please check the code comments or consult the documentation for the technologies used.
