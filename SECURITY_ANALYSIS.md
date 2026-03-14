# Security Analysis Report - Yakkai Neri Project

**Analysis Date:** March 6, 2026  
**Project:** Yakkai Neri - Yoga Training & Wellness Website  
**Technology Stack:** React Frontend + PHP Backend + MySQL

---

## Executive Summary

This security analysis identified **13 security issues** ranging from **CRITICAL** to **LOW** severity. The most critical issues involve hardcoded credentials, authentication bypass mechanisms, and weak default secrets. Immediate action is required to address the CRITICAL and HIGH severity issues before production deployment.

---

## Critical Severity Issues (IMMEDIATE ACTION REQUIRED)

### 1. 🔴 Hardcoded Admin Credentials in Frontend
**File:** `frontend/src/context/AuthContext.jsx`  
**Lines:** 6-7

```javascript
const ADMIN_EMAIL = 'admin@yakkaineri.com';
const ADMIN_PASSWORD = 'admin123';
```

**Risk:** Anyone with access to the frontend source code (which is publicly visible) can authenticate as an administrator.

**Impact:** Complete system compromise, unauthorized access to all admin features.

**Recommendation:**
- Remove all hardcoded credentials immediately
- Implement proper backend authentication for all admin operations
- Use environment variables for any default credentials (development only)

---

### 2. 🔴 Local Admin Token Bypass Mechanism
**File:** `backend/middleware/AuthMiddleware.php`  
**Lines:** 17-27

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

**Risk:** Any token matching the pattern `local-admin-token-{number}` bypasses JWT verification and grants full admin access.

**Impact:** Authentication bypass, privilege escalation, complete admin access without valid credentials.

**Recommendation:**
- Remove this bypass mechanism entirely from production code
- If needed for development, use environment variable check:
  ```php
  if ($_ENV['APP_ENV'] === 'development' && preg_match('/^local-admin-token-\d+$/', $token)) {
  ```

---

### 3. 🔴 Weak Default JWT Secret
**File:** `backend/.env`  
**Current Value:** `yakkai_neri_secret_key_2024_change_this`

**Risk:** Predictable secret key allows JWT token forgery.

**Impact:** Attackers can create valid authentication tokens, impersonate users, gain unauthorized access.

**Recommendation:**
- Generate a strong random secret (minimum 64 characters)
- Use a cryptographically secure random generator:
  ```bash
  openssl rand -base64 64
  ```
- Never commit the actual `.env` file to version control

---

### 4. 🔴 Environment File Committed to Repository
**File:** `backend/.env`

**Risk:** Database credentials and secrets exposed in version control history.

**Impact:** Database compromise if repository is public or leaked.

**Recommendation:**
- Remove `.env` from repository: `git rm --cached backend/.env`
- Add to `.gitignore` immediately
- Rotate all exposed credentials (database passwords, JWT secrets)
- Use `.env.example` as template only

---

## High Severity Issues

### 5. 🟠 Exposed Database Error Messages
**Multiple Files:** All PHP route files

**Example:**
```php
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
```

**Risk:** Database structure, table names, and query details exposed to attackers.

**Impact:** Information disclosure aids SQL injection and database enumeration attacks.

**Recommendation:**
```php
catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage()); // Log for debugging
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred. Please try again later.']);
}
```

---

### 6. 🟠 No Rate Limiting on Authentication Endpoints
**Files:** `backend/routes/auth.php`, `backend/routes/hr_users.php`

**Risk:** Brute force attacks on login endpoints.

**Impact:** Account compromise through password guessing, denial of service.

**Recommendation:**
- Implement rate limiting (e.g., 5 login attempts per IP per 15 minutes)
- Add account lockout after failed attempts
- Use PHP rate limiting libraries or implement Redis-based rate limiting
- Consider implementing CAPTCHA after multiple failed attempts

---

### 7. 🟠 Missing Security Headers
**All PHP Files**

**Risk:** Clickjacking, XSS, MIME sniffing attacks.

**Impact:** Reduced defense against common web attacks.

**Recommendation:**
Add to `backend/config/cors.php`:
```php
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
```

---

### 8. 🟠 No HTTPS Enforcement
**File:** Backend not enforcing HTTPS in production

**Risk:** Man-in-the-middle attacks, credential interception.

**Impact:** Tokens and credentials sent in plaintext over HTTP.

**Recommendation:**
Add to `backend/index.php`:
```php
if ($_ENV['APP_ENV'] === 'production' && 
    (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on')) {
    header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit;
}
```

---

## Medium Severity Issues

### 9. 🟡 File Upload MIME Type Validation Only
**File:** `backend/routes/upload.php`  
**Lines:** 36-40

```php
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
if (!in_array($file['type'], $allowedTypes)) {
    // reject
}
```

**Risk:** MIME type can be spoofed; malicious files disguised as images.

**Impact:** Server-side code execution if malicious files are uploaded.

**Recommendation:**
- Add file extension validation
- Use `getimagesize()` to verify actual image format
- Generate new filename with safe extension
- Store uploads outside web root if possible
```php
$imageInfo = @getimagesize($file['tmp_name']);
if ($imageInfo === false) {
    // Not a valid image
    http_response_code(400);
    echo json_encode(['error' => 'Invalid image file']);
    return;
}
```

---

### 10. 🟡 CORS Fallback to Localhost
**File:** `backend/config/cors.php`  
**Lines:** 23-28

```php
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: http://localhost:5173');
}
```

**Risk:** Unintended cross-origin access in production.

**Impact:** Potential for CSRF attacks from localhost-spoofing.

**Recommendation:**
```php
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif ($_ENV['APP_ENV'] === 'development') {
    header('Access-Control-Allow-Origin: http://localhost:5173');
} else {
    // Deny unknown origins in production
    http_response_code(403);
    echo json_encode(['error' => 'Origin not allowed']);
    exit;
}
```

---

### 11. 🟡 SQL Injection Risk in HR Users Route
**File:** `backend/routes/hr_users.php` (check dynamically built queries)

**Risk:** While most queries use prepared statements, any dynamic SQL construction poses risk.

**Impact:** Database compromise, data theft.

**Recommendation:**
- Audit all database queries
- Ensure ALL user input uses parameterized queries
- Never concatenate user input into SQL strings
- Use PDO with `PDO::ATTR_EMULATE_PREPARES => false` (already configured ✓)

---

### 12. 🟡 No Input Sanitization for Display
**Multiple Files:** Data displayed without HTML escaping

**Risk:** Stored XSS attacks.

**Impact:** JavaScript execution in victim browsers, session hijacking.

**Recommendation:**
- HTML-escape all user-generated content before display
- Use `htmlspecialchars($data, ENT_QUOTES, 'UTF-8')` in PHP
- In React, avoid `dangerouslySetInnerHTML` (currently not used ✓)

---

## Low Severity Issues

### 13. 🟢 Insufficient Password Complexity Requirements
**File:** `backend/routes/auth.php`

**Current:** No password policy enforced

**Risk:** Weak passwords chosen by users.

**Impact:** Easier brute force attacks.

**Recommendation:**
```php
if (strlen($password) < 8 || 
    !preg_match('/[A-Z]/', $password) ||
    !preg_match('/[a-z]/', $password) ||
    !preg_match('/[0-9]/', $password)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Password must be at least 8 characters with uppercase, lowercase, and number'
    ]);
    exit;
}
```

---

## Positive Security Features Found ✅

1. **PDO Prepared Statements:** All database queries properly use prepared statements with bound parameters
2. **Password Hashing:** Uses `password_hash()` with bcrypt (PASSWORD_BCRYPT)
3. **Email Validation:** Uses `filter_var()` with FILTER_VALIDATE_EMAIL
4. **JWT Implementation:** Proper JWT structure with HMAC-SHA256 signing
5. **CORS Configuration:** Explicit origin whitelist (needs improvement but foundation is good)
6. **No Eval Usage:** No dangerous functions like `eval()`, `exec()`, `system()` found
7. **No Dangerous React Patterns:** No `dangerouslySetInnerHTML` usage found

---

## Priority Action Items

### Immediate (Before Production)
1. Remove hardcoded admin credentials from frontend
2. Remove local-admin-token bypass mechanism (or restrict to development)
3. Generate strong JWT secret and rotate credentials
4. Remove `.env` from version control and add to `.gitignore`
5. Implement generic error messages (hide database details)

### High Priority (Within 1 Week)
6. Add rate limiting to authentication endpoints
7. Implement security headers
8. Enforce HTTPS in production
9. Improve file upload validation

### Medium Priority (Within 1 Month)
10. Fix CORS fallback logic
11. Implement password complexity requirements
12. Add comprehensive input sanitization
13. Implement logging and monitoring

---

## Security Testing Recommendations

1. **Penetration Testing:** Conduct professional penetration test before production
2. **OWASP Top 10:** Test against all OWASP Top 10 vulnerabilities
3. **Dependency Scanning:** Use tools like `npm audit` and PHP security scanners
4. **Code Review:** Conduct security-focused code review with security expert
5. **Automated Scanning:** Integrate security scanning into CI/CD pipeline

---

## Additional Recommendations

### Infrastructure
- Use WAF (Web Application Firewall) like Cloudflare or AWS WAF
- Implement DDoS protection
- Use separate database user with minimum required privileges
- Enable database audit logging
- Regular automated backups with encryption

### Development Practices
- Security training for development team
- Implement security code review checklist
- Use static analysis security tools
- Regular dependency updates
- Secrets management system (e.g., Vault, AWS Secrets Manager)

### Monitoring
- Implement centralized logging
- Set up alerts for suspicious activities
- Monitor failed authentication attempts
- Track file upload activities
- Regular security audits

---

## Compliance Considerations

If handling user data in EU/EEA:
- **GDPR Compliance:** Implement data protection measures, consent management, right to erasure
- **Data Encryption:** Encrypt sensitive data at rest and in transit
- **Privacy Policy:** Update and display privacy policy
- **Data Breach Notification:** Implement incident response procedures

---

## Conclusion

The Yakkai Neri project has a solid foundation with proper use of prepared statements and password hashing. However, the critical issues related to hardcoded credentials and authentication bypass mechanisms must be addressed immediately. 

**Current Security Posture:** 🔴 **NOT PRODUCTION READY**

After addressing CRITICAL and HIGH severity issues:
**Target Security Posture:** 🟢 **PRODUCTION READY**

---

## Contact for Security Issues

If you discover any security vulnerabilities, please report them responsibly to the development team. Do not create public issues for security vulnerabilities.

---

*This security analysis was conducted on March 6, 2026. Security is an ongoing process - regular re-assessments are recommended.*
