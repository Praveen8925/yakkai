# Security Fixes Implementation Guide

This document provides step-by-step instructions to fix the security issues identified in `SECURITY_ANALYSIS.md`.

## Priority 1: Critical Fixes (DO THESE FIRST!)

### Fix 1: Remove Hardcoded Admin Credentials

**File:** `frontend/src/context/AuthContext.jsx`

**Current Code (Lines 6-7):**
```javascript
const ADMIN_EMAIL = 'admin@yakkaineri.com';
const ADMIN_PASSWORD = 'admin123';
```

**Fix:** Remove the hardcoded credentials and connect to the backend API:

```javascript
import api from '../api/axios';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Use the backend API for authentication
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return userData;
        } catch (error) {
            throw error;
        }
    };

    // ... rest of the code
}
```

---

### Fix 2: Remove Local Admin Token Bypass

**File:** `backend/middleware/AuthMiddleware.php`

**Current Code (Lines 17-27):**
```php
if (preg_match('/^local-admin-token-\d+$/', $token)) {
    return [
        'id' => 1,
        'name' => 'Admin',
        'email' => 'admin@yakkaineri.com',
        'role' => 'admin',
        'iat' => time(),
        'exp' => time() + 86400,
    ];
}
```

**Option A - Remove Completely (Recommended for Production):**
Delete lines 17-27 entirely.

**Option B - Restrict to Development Only:**
```php
// Allow local development bypass only in development environment
if ($_ENV['APP_ENV'] === 'development' && preg_match('/^local-admin-token-\d+$/', $token)) {
    error_log('WARNING: Using local development token bypass');
    return [
        'id' => 1,
        'name' => 'Dev Admin',
        'email' => 'dev@localhost',
        'role' => 'admin',
        'iat' => time(),
        'exp' => time() + 86400,
    ];
}
```

---

### Fix 3: Generate Strong JWT Secret

**File:** `backend/.env`

**Current Value:**
```env
JWT_SECRET=yakkai_neri_secret_key_2024_change_this
```

**Fix:**

1. Generate a strong secret:
   ```bash
   # Linux/Mac:
   openssl rand -base64 64
   
   # Windows PowerShell:
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
   ```

2. Update `.env`:
   ```env
   JWT_SECRET=<your-generated-64+-character-random-string-here>
   ```

---

### Fix 4: Remove .env from Git and Add to .gitignore

**Steps:**

1. Remove from git history:
   ```bash
   git rm --cached backend/.env
   git commit -m "Remove .env from version control"
   ```

2. Ensure `.gitignore` includes (already added in root `.gitignore`):
   ```
   .env
   backend/.env
   ```

3. Create an admin user in the database:
   ```sql
   INSERT INTO users (name, email, password, role, created_at, updated_at)
   VALUES (
       'Admin User',
       'admin@yakkaineri.com',
       '$2y$10$YourHashedPasswordHere',  -- Generate using password_hash('your_password', PASSWORD_BCRYPT)
       'admin',
       NOW(),
       NOW()
   );
   ```

4. Generate password hash in PHP:
   ```php
   <?php
   // Run this once to generate your admin password hash
   echo password_hash('YourSecurePasswordHere123!', PASSWORD_BCRYPT);
   ```

---

## Priority 2: High Severity Fixes

### Fix 5: Hide Database Error Messages

**Files:** All route files in `backend/routes/`

**Search for:**
```php
echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
```

**Replace with:**
```php
error_log('Database error: ' . $e->getMessage()); // Log for debugging
http_response_code(500);
echo json_encode(['error' => 'An error occurred. Please try again later.']);
```

**Create a helper function in `backend/utils/ErrorHandler.php`:**
```php
<?php
class ErrorHandler {
    public static function handleDatabaseError(PDOException $e, string $context = '') {
        // Log the error with context for debugging
        error_log("Database Error [$context]: " . $e->getMessage());
        error_log("Stack trace: " . $e->getTraceAsString());
        
        // Return generic message to user
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'An error occurred while processing your request. Please try again later.'
        ]);
    }
}
```

**Usage:**
```php
try {
    // Database operations
} catch (PDOException $e) {
    ErrorHandler::handleDatabaseError($e, 'Creating program');
    exit;
}
```

---

### Fix 6: Implement Rate Limiting on Authentication

**File:** Create `backend/middleware/RateLimiter.php`

```php
<?php
class RateLimiter {
    private static $cacheDir = __DIR__ . '/../cache/rate_limits/';
    
    /**
     * Check if request is rate limited
     * @param string $key Unique identifier (e.g., IP address, email)
     * @param int $maxAttempts Maximum attempts allowed
     * @param int $decayMinutes Time window in minutes
     * @return bool True if rate limit exceeded
     */
    public static function tooManyAttempts(string $key, int $maxAttempts = 5, int $decayMinutes = 15): bool {
        if (!file_exists(self::$cacheDir)) {
            mkdir(self::$cacheDir, 0755, true);
        }
        
        $file = self::$cacheDir . md5($key) . '.json';
        $now = time();
        
        $data = file_exists($file) ? json_decode(file_get_contents($file), true) : null;
        
        if (!$data || $now > $data['expires_at']) {
            // Reset counter
            $data = [
                'attempts' => 1,
                'expires_at' => $now + ($decayMinutes * 60)
            ];
            file_put_contents($file, json_encode($data));
            return false;
        }
        
        if ($data['attempts'] >= $maxAttempts) {
            return true;
        }
        
        // Increment attempts
        $data['attempts']++;
        file_put_contents($file, json_encode($data));
        
        return false;
    }
    
    /**
     * Clear rate limit for a key (call on successful login)
     */
    public static function clear(string $key): void {
        $file = self::$cacheDir . md5($key) . '.json';
        if (file_exists($file)) {
            unlink($file);
        }
    }
    
    /**
     * Get remaining attempts
     */
    public static function attemptsLeft(string $key, int $maxAttempts = 5): int {
        $file = self::$cacheDir . md5($key) . '.json';
        
        if (!file_exists($file)) {
            return $maxAttempts;
        }
        
        $data = json_decode(file_get_contents($file), true);
        $now = time();
        
        if ($now > $data['expires_at']) {
            return $maxAttempts;
        }
        
        return max(0, $maxAttempts - $data['attempts']);
    }
}
```

**Update:** `backend/routes/auth.php`

Add at the beginning of login route:
```php
require_once __DIR__ . '/../middleware/RateLimiter.php';

// In the login route handler:
$ip = $_SERVER['REMOTE_ADDR'];
$rateLimitKey = 'login:' . $ip . ':' . $email;

if (RateLimiter::tooManyAttempts($rateLimitKey, 5, 15)) {
    http_response_code(429);
    echo json_encode([
        'error' => 'Too many login attempts. Please try again in 15 minutes.',
        'retry_after' => 900 // seconds
    ]);
    exit;
}

// ... existing login logic ...

// On successful login, clear rate limit:
RateLimiter::clear($rateLimitKey);
```

---

### Fix 7: Add Security Headers

**File:** `backend/config/cors.php`

Add after existing headers:
```php
// Security headers
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// Content Security Policy (adjust as needed)
$csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",  // Remove unsafe-inline in production if possible
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'"
];
header('Content-Security-Policy: ' . implode('; ', $csp));
```

---

### Fix 8: Enforce HTTPS in Production

**File:** `backend/index.php`

Add at the very beginning (after .env loading):
```php
// Enforce HTTPS in production
if ($_ENV['APP_ENV'] === 'production') {
    if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') {
        $redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        header('HTTP/1.1 301 Moved Permanently');
        header('Location: ' . $redirect);
        exit;
    }
    
    // Add HSTS header (HTTP Strict Transport Security)
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
}
```

---

## Priority 3: Medium Severity Fixes

### Fix 9: Improve File Upload Validation

**File:** `backend/routes/upload.php`

Replace the validation section:
```php
function uploadImage() {
    try {
        if (!isset($_FILES['image'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No image file provided']);
            return;
        }

        $file = $_FILES['image'];
        $maxSize = 5 * 1024 * 1024; // 5MB

        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(500);
            echo json_encode(['error' => 'Upload failed']);
            return;
        }

        // Verify it's actually an image (not just MIME type)
        $imageInfo = @getimagesize($file['tmp_name']);
        if ($imageInfo === false) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid image file']);
            return;
        }

        // Check allowed image types
        $allowedMimeTypes = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP];
        if (!in_array($imageInfo[2], $allowedMimeTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Only JPG, PNG, and WebP images are allowed']);
            return;
        }

        // Check file size
        if ($file['size'] > $maxSize) {
            http_response_code(400);
            echo json_encode(['error' => 'File too large. Maximum size is 5MB']);
            return;
        }

        // Generate safe filename
        $extension = image_type_to_extension($imageInfo[2], false);
        $filename = uniqid('img_', true) . '_' . time() . '.' . $extension;
        
        // Create uploads directory if it doesn't exist
        $uploadDir = __DIR__ . '/../../frontend/public/uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $filepath = $uploadDir . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save uploaded file']);
            return;
        }

        // Additional: Re-encode the image to strip any malicious data
        reencodeImage($filepath, $imageInfo[2]);

        // Return the URL path
        $imageUrl = '/uploads/' . $filename;
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'url' => $imageUrl,
            'message' => 'Image uploaded successfully'
        ]);

    } catch (Exception $e) {
        error_log('Upload error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Server error occurred']);
    }
}

function reencodeImage($filepath, $imageType) {
    // Re-encode the image to remove any potential malicious data
    switch ($imageType) {
        case IMAGETYPE_JPEG:
            $image = imagecreatefromjpeg($filepath);
            imagejpeg($image, $filepath, 85);
            break;
        case IMAGETYPE_PNG:
            $image = imagecreatefrompng($filepath);
            imagepng($image, $filepath, 8);
            break;
        case IMAGETYPE_WEBP:
            $image = imagecreatefromwebp($filepath);
            imagewebp($image, $filepath, 85);
            break;
    }
    if (isset($image)) {
        imagedestroy($image);
    }
}
```

---

### Fix 10: Fix CORS Fallback Logic

**File:** `backend/config/cors.php`

Replace the CORS origin handling:
```php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif ($_ENV['APP_ENV'] === 'development') {
    // Only allow localhost fallback in development
    header('Access-Control-Allow-Origin: http://localhost:5173');
    error_log("CORS: Unknown origin '$origin' allowed (development mode)");
} else {
    // Production: deny unknown origins
    error_log("CORS: Rejected origin '$origin'");
    http_response_code(403);
    echo json_encode(['error' => 'Origin not allowed']);
    exit;
}
```

---

### Fix 11: Add Password Complexity Requirements

**File:** `backend/routes/auth.php`

Add before password hashing in register route:
```php
// Validate password strength
if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 8 characters long']);
    exit;
}

if (!preg_match('/[A-Z]/', $password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must contain at least one uppercase letter']);
    exit;
}

if (!preg_match('/[a-z]/', $password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must contain at least one lowercase letter']);
    exit;
}

if (!preg_match('/[0-9]/', $password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must contain at least one number']);
    exit;
}

// Optional: require special character
if (!preg_match('/[^A-Za-z0-9]/', $password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must contain at least one special character']);
    exit;
}
```

Or create a reusable validator:
```php
// backend/utils/PasswordValidator.php
<?php
class PasswordValidator {
    public static function validate(string $password): array {
        $errors = [];
        
        if (strlen($password) < 8) {
            $errors[] = 'Password must be at least 8 characters long';
        }
        
        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = 'Password must contain at least one uppercase letter';
        }
        
        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = 'Password must contain at least one lowercase letter';
        }
        
        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = 'Password must contain at least one number';
        }
        
        if (!preg_match('/[^A-Za-z0-9]/', $password)) {
            $errors[] = 'Password must contain at least one special character (!@#$%^&*)';
        }
        
        return ['valid' => empty($errors), 'errors' => $errors];
    }
}
```

---

## Testing After Fixes

### 1. Test Authentication
```bash
# Should fail with rate limiting after 5 attempts
for i in {1..6}; do
  curl -X POST http://localhost/backend/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

### 2. Test File Upload
```bash
# Try uploading a non-image file (should fail)
curl -X POST http://localhost/backend/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@malicious.php"
```

### 3. Test Security Headers
```bash
curl -I http://localhost/backend/api/auth/me
# Should see X-Frame-Options, X-Content-Type-Options, etc.
```

### 4. Test Password Validation
```bash
# Should fail with weak password
curl -X POST http://localhost/backend/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123"}'
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All CRITICAL fixes applied
- [ ] All HIGH severity fixes applied
- [ ] Strong JWT_SECRET generated
- [ ] All default passwords changed
- [ ] `.env` removed from git
- [ ] HTTPS configured and enforced
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] File upload validation tested
- [ ] Error logging configured
- [ ] Database backups automated
- [ ] Monitoring/alerting set up

---

## Additional Security Measures

### 1. Enable MySQL SSL Connection
```php
// In backend/config/database.php
$options = [
    PDO::MYSQL_ATTR_SSL_CA => '/path/to/ca-cert.pem',
    PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true,
    // ... other options
];
```

### 2. Add CAPTCHA to Contact Form
Consider integrating Google reCAPTCHA v3 for the contact form to prevent spam.

### 3. Implement Session Management
For better security than localStorage, consider server-side sessions with HTTP-only cookies.

### 4. Add API Request Logging
```php
// Log all API requests for security monitoring
error_log(sprintf(
    'API Request: %s %s from %s',
    $_SERVER['REQUEST_METHOD'],
    $_SERVER['REQUEST_URI'],
    $_SERVER['REMOTE_ADDR']
));
```

---

**Last Updated:** March 6, 2026  
**Status:** Implementation Pending

Remember to test thoroughly after each fix!
