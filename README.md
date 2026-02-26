# Yakkai Neri - Yoga Training & Wellness Website

A comprehensive yoga training and wellness platform featuring program management, gallery, and content management capabilities.

## 🌟 Features

### Public Features
- **Home Page**: Showcase yoga programs and trainer information
- **Programs**: Multiple specialized yoga programs including:
  - Yoga for Sport & Yoga as Sport
  - Corporate Yoga
  - Women Wellness & Prenatal/Postnatal
  - Adolescence Programs
  - Tech-Supported Yoga
- **Meet the Trainer**: Professional profile and credentials
- **Wellness & Therapy**: Information about therapeutic yoga services
- **Contact**: Get in touch with the trainer
- **Gallery**: View images from training sessions and events

### Admin Features
- **Secure Authentication**: JWT-based login system
- **Program Management**: Create, edit, and delete yoga programs
- **Gallery Management**: Upload and manage images
- **Page Content Management**: Update website content dynamically
- **Dashboard**: Overview of all administrative functions

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern UI library
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **React Router**: Client-side routing

### Backend
- **PHP 8+**: Server-side scripting
- **MySQL**: Database management
- **JWT**: JSON Web Token authentication
- **Composer**: Dependency management

## 📋 Prerequisites

- **PHP** 8.0 or higher
- **MySQL** 5.7 or higher
- **Node.js** 16+ and npm
- **Composer** for PHP dependencies
- **WAMP/XAMPP/LAMP** (or any Apache server)

## 🚀 Installation & Setup

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Praveen8925/yakkai.git
   cd yakkai
   ```

2. **Configure the database**
   - Create a MySQL database
   - Import the database schema:
     ```bash
     mysql -u your_username -p your_database < backend/migrations/create_tables.sql
     mysql -u your_username -p your_database < backend/migrations/add_admin_tables.sql
     ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in the backend folder
   ```bash
   cd backend
   cp .env.example .env
   ```
   - Update the `.env` file with your database credentials:
     ```
     DB_HOST=localhost
     DB_NAME=your_database_name
     DB_USER=your_username
     DB_PASS=your_password
     JWT_SECRET=your_secret_key
     ```

4. **Install PHP dependencies**
   ```bash
   composer install
   ```

5. **Seed the database (optional)**
   ```bash
   php seed/seed.php
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   - Update the API base URL in `src/api/axios.js` to match your backend URL

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Backend Configuration
- **CORS**: Configure allowed origins in `backend/config/cors.php`
- **Database**: Database settings in `backend/config/database.php`
- **JWT**: Set JWT secret in `backend/.env`

### Frontend Configuration
- **Vite**: Configuration in `vite.config.js`
- **Tailwind**: Styling configuration in `tailwind.config.js`
- **API URL**: Update in `src/api/axios.js`

## 📂 Project Structure

```
yakkai/
├── backend/
│   ├── config/          # Configuration files
│   ├── middleware/      # Authentication middleware
│   ├── migrations/      # Database migrations
│   ├── routes/          # API routes
│   ├── seed/            # Database seeders
│   ├── utils/           # Utility classes (JWT Handler)
│   └── index.php        # Main entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── api/         # API configuration
│   │   ├── components/  # React components
│   │   ├── context/     # React context (Auth)
│   │   ├── hooks/       # Custom hooks
│   │   └── pages/       # Page components
│   └── index.html       # HTML entry point
└── images/              # Project images
```

## 🔐 Default Admin Credentials

After running the seed script, you can log in with:
- **Username**: admin
- **Password**: Check the seed file for default password

**Important**: Change the default password after first login!

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Programs
- `GET /api/programs` - Get all programs
- `POST /api/programs` - Create program (Admin)
- `PUT /api/programs/:id` - Update program (Admin)
- `DELETE /api/programs/:id` - Delete program (Admin)

### Gallery
- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Upload image (Admin)
- `DELETE /api/gallery/:id` - Delete image (Admin)

### Pages
- `GET /api/pages/:slug` - Get page content
- `PUT /api/pages/:slug` - Update page content (Admin)

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
```
The production build will be in the `dist` folder.

### Backend Deployment
- Upload the backend folder to your hosting server
- Ensure PHP 8+ is installed
- Configure the web server to point to the backend directory
- Set up the database and import migrations
- Update `.env` with production credentials
- Ensure proper file permissions for uploads folder

## 📝 Development

### Start Development Servers

**Backend (WAMP/XAMPP)**
- Ensure Apache and MySQL are running
- Access via `http://localhost/yakkai/backend`

**Frontend**
```bash
cd frontend
npm run dev
```
Access via `http://localhost:5173`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📧 Contact

For any queries or support, please contact through the website's contact form.

## 🙏 Acknowledgments

- Built for Yakkai Neri Yoga Training Center
- Designed to manage and showcase professional yoga training programs
- Developed with modern web technologies for optimal performance

---

**Note**: This is a production application. Ensure all security best practices are followed when deploying to a live environment.
