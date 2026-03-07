# Multi-stage Dockerfile for Yakkai Neri Project
# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy frontend source
COPY frontend/ ./

# Build frontend (production mode)
RUN npm run build

# ============================================================================
# Stage 2: PHP Backend with Apache
FROM php:8.2-apache AS backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Enable Apache modules
RUN a2enmod rewrite headers expires

# Configure PHP for production
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Custom PHP configuration
RUN { \
    echo 'memory_limit=256M'; \
    echo 'upload_max_filesize=10M'; \
    echo 'post_max_size=10M'; \
    echo 'max_execution_time=300'; \
    echo 'max_input_time=300'; \
    echo 'display_errors=Off'; \
    echo 'log_errors=On'; \
    echo 'error_log=/var/log/php/error.log'; \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=60'; \
    echo 'opcache.fast_shutdown=1'; \
} > $PHP_INI_DIR/conf.d/custom.ini

# Create PHP error log directory
RUN mkdir -p /var/log/php && chown www-data:www-data /var/log/php

# Set working directory
WORKDIR /var/www/html

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Install PHP dependencies (skip dev dependencies in production)
RUN if [ -f backend/composer.json ]; then \
    cd backend && composer install --no-dev --optimize-autoloader --no-interaction; \
    fi

# Create required directories
RUN mkdir -p \
    /var/www/html/backend/uploads \
    /var/www/html/frontend/public/uploads \
    /var/www/html/backend/logs

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/backend/uploads \
    && chmod -R 775 /var/www/html/frontend/public/uploads \
    && chmod -R 775 /var/www/html/backend/logs

# Apache configuration
RUN { \
    echo '<VirtualHost *:80>'; \
    echo '    ServerAdmin admin@yakkaineri.com'; \
    echo '    DocumentRoot /var/www/html/frontend/dist'; \
    echo ''; \
    echo '    # Frontend - serve static React app'; \
    echo '    <Directory /var/www/html/frontend/dist>'; \
    echo '        Options -Indexes +FollowSymLinks'; \
    echo '        AllowOverride All'; \
    echo '        Require all granted'; \
    echo '        # React Router - redirect all routes to index.html'; \
    echo '        RewriteEngine On'; \
    echo '        RewriteBase /'; \
    echo '        RewriteRule ^index\.html$ - [L]'; \
    echo '        RewriteCond %{REQUEST_FILENAME} !-f'; \
    echo '        RewriteCond %{REQUEST_FILENAME} !-d'; \
    echo '        RewriteRule . /index.html [L]'; \
    echo '    </Directory>'; \
    echo ''; \
    echo '    # Backend API'; \
    echo '    Alias /backend /var/www/html/backend'; \
    echo '    <Directory /var/www/html/backend>'; \
    echo '        Options -Indexes'; \
    echo '        AllowOverride All'; \
    echo '        Require all granted'; \
    echo '        # Route all API requests through index.php'; \
    echo '        RewriteEngine On'; \
    echo '        RewriteCond %{REQUEST_FILENAME} !-f'; \
    echo '        RewriteCond %{REQUEST_FILENAME} !-d'; \
    echo '        RewriteRule ^(.*)$ /backend/index.php [QSA,L]'; \
    echo '    </Directory>'; \
    echo ''; \
    echo '    # Uploaded files'; \
    echo '    Alias /uploads /var/www/html/frontend/public/uploads'; \
    echo '    <Directory /var/www/html/frontend/public/uploads>'; \
    echo '        Options -Indexes'; \
    echo '        AllowOverride None'; \
    echo '        Require all granted'; \
    echo '    </Directory>'; \
    echo ''; \
    echo '    # Security headers'; \
    echo '    Header always set X-Frame-Options "DENY"'; \
    echo '    Header always set X-Content-Type-Options "nosniff"'; \
    echo '    Header always set X-XSS-Protection "1; mode=block"'; \
    echo '    Header always set Referrer-Policy "strict-origin-when-cross-origin"'; \
    echo ''; \
    echo '    # Error and access logs'; \
    echo '    ErrorLog ${APACHE_LOG_DIR}/error.log'; \
    echo '    CustomLog ${APACHE_LOG_DIR}/access.log combined'; \
    echo '</VirtualHost>'; \
} > /etc/apache2/sites-available/000-default.conf

# .htaccess for backend (additional security)
RUN { \
    echo 'RewriteEngine On'; \
    echo 'RewriteCond %{REQUEST_FILENAME} !-f'; \
    echo 'RewriteCond %{REQUEST_FILENAME} !-d'; \
    echo 'RewriteRule ^(.*)$ index.php [QSA,L]'; \
    echo ''; \
    echo '# Prevent access to .env file'; \
    echo '<Files ".env">'; \
    echo '    Require all denied'; \
    echo '</Files>'; \
    echo ''; \
    echo '# Prevent access to vendor directory'; \
    echo '<DirectoryMatch "vendor/">'; \
    echo '    Require all denied'; \
    echo '</DirectoryMatch>'; \
} > /var/www/html/backend/.htaccess

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Switch to www-data user for running Apache
USER www-data

# Start Apache in foreground
CMD ["apache2-foreground"]
