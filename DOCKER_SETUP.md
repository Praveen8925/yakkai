# Docker Setup Guide - Yakkai Neri

This guide explains how to run the Yakkai Neri project using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- At least 2GB free disk space
- Ports 80, 3307, and 8080 available (or configure different ports)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd yakkai-main
```

### 2. Configure Environment Variables

Copy the Docker environment template:

```bash
cp .env.docker .env
```

Edit `.env` and update the following **critical values**:

```env
# Generate a strong JWT secret (REQUIRED!)
JWT_SECRET=your_strong_random_64_character_string_here

# Set secure database passwords
DB_ROOT_PASSWORD=your_secure_root_password
DB_PASS=your_secure_database_password
```

Generate a secure JWT secret:

```bash
# Using OpenSSL
openssl rand -base64 64

# Using PowerShell (Windows)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### 3. Build and Start Containers

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### 4. Initialize Database

The database will be automatically initialized with the migration files on first startup. If you need to manually run migrations:

```bash
# Access MySQL container
docker-compose exec mysql bash

# Run migrations
mysql -u yakkai_user -p yakkai_neri < /docker-entrypoint-initdb.d/create_tables.sql
mysql -u yakkai_user -p yakkai_neri < /docker-entrypoint-initdb.d/add_admin_tables.sql
# ... run other migration files as needed
```

### 5. Access the Application

- **Frontend/Website:** http://localhost
- **Backend API:** http://localhost/backend/api
- **phpMyAdmin:** http://localhost:8080 (optional, see below)

## Container Architecture

The Docker setup consists of three services:

### 1. MySQL Container (`mysql`)
- **Image:** MySQL 8.0
- **Purpose:** Database server
- **Port:** 3307 (mapped from container port 3306)
- **Data Persistence:** `mysql_data` volume

### 2. Web Container (`web`)
- **Built From:** Multi-stage Dockerfile
- **Components:**
  - PHP 8.2 with Apache
  - React frontend (production build)
  - Backend API
- **Port:** 80
- **Volumes:**
  - `uploads_data` - Persistent user uploads
  - `logs_data` - Application logs

### 3. phpMyAdmin Container (`phpmyadmin`) - Optional
- **Image:** phpMyAdmin
- **Purpose:** Database management interface
- **Port:** 8080

## Docker Commands Reference

### Managing Containers

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart web

# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service_name]
```

### Rebuilding

```bash
# Rebuild after code changes
docker-compose up -d --build

# Force rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### Database Management

```bash
# Create database backup
docker-compose exec mysql mysqldump -u yakkai_user -p yakkai_neri > backup_$(date +%Y%m%d).sql

# Restore database backup
docker-compose exec -T mysql mysql -u yakkai_user -p yakkai_neri < backup.sql

# Access MySQL CLI
docker-compose exec mysql mysql -u yakkai_user -p yakkai_neri
```

### Accessing Containers

```bash
# Access web container shell
docker-compose exec web bash

# Access MySQL container shell
docker-compose exec mysql bash

# View web server error logs
docker-compose exec web cat /var/log/apache2/error.log
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect a volume
docker volume inspect yakkai-main_mysql_data

# Remove unused volumes (WARNING: deletes data)
docker volume prune
```

## Optional Services

### phpMyAdmin

By default, phpMyAdmin is configured with a profile and won't start automatically. To start it:

```bash
# Start with phpMyAdmin
docker-compose --profile tools up -d

# Access at http://localhost:8080
# Login with DB_USER and DB_PASS from .env
```

**Security Note:** Disable phpMyAdmin in production or protect it with additional authentication.

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_ROOT_PASSWORD` | MySQL root password | - | Yes |
| `DB_NAME` | Database name | yakkai_neri | Yes |
| `DB_USER` | Database user | yakkai_user | Yes |
| `DB_PASS` | Database password | - | Yes |
| `DB_PORT` | External MySQL port | 3307 | No |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRY` | JWT token expiry (seconds) | 86400 | No |
| `APP_ENV` | Environment (development/production) | production | Yes |
| `APP_URL` | Application base URL | http://localhost | Yes |
| `WEB_PORT` | External web server port | 80 | No |
| `PHPMYADMIN_PORT` | External phpMyAdmin port | 8080 | No |

## File Structure in Containers

```
/var/www/html/
├── frontend/
│   └── dist/              # Built React app (production)
│       ├── index.html
│       ├── assets/
│       └── ...
├── backend/
│   ├── index.php          # API entry point
│   ├── routes/            # API routes
│   ├── config/            # Configuration files
│   ├── middleware/        # Authentication middleware
│   ├── uploads/           # Backend uploads
│   ├── logs/              # Application logs
│   └── .env               # Mounted from host
└── uploads/               # Public uploads (images, etc.)
```

## Production Deployment

### 1. Security Checklist

**Before deploying to production, complete these steps:**

- [ ] Review and implement fixes from `SECURITY_ANALYSIS.md`
- [ ] Generate strong random JWT_SECRET
- [ ] Set strong database passwords
- [ ] Remove hardcoded credentials from frontend
- [ ] Disable local-admin-token bypass in AuthMiddleware
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Configure HTTPS (see below)
- [ ] Hide phpMyAdmin or protect with authentication
- [ ] Enable rate limiting on authentication endpoints
- [ ] Set up automated database backups
- [ ] Configure monitoring and logging

### 2. HTTPS Configuration

For production, use a reverse proxy (nginx or Traefik) with Let's Encrypt:

**Example with nginx:**

```bash
# docker-compose.prod.yml
services:
  nginx:
    image: nginx:alpine
    container_name: yakkai_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - certbot_www:/var/www/certbot
      - certbot_conf:/etc/letsencrypt
    depends_on:
      - web
    networks:
      - yakkai_network

  certbot:
    image: certbot/certbot
    container_name: yakkai_certbot
    volumes:
      - certbot_www:/var/www/certbot
      - certbot_conf:/etc/letsencrypt
    command: certonly --webroot -w /var/www/certbot --email your@email.com -d yourdomain.com --agree-tos --no-eff-email

  web:
    # ... existing config
    expose:
      - "80"  # Don't expose directly, only through nginx
    ports: []  # Remove direct port mapping
```

### 3. Docker Swarm / Kubernetes

For high-availability production deployments:

- Use Docker Swarm or Kubernetes for orchestration
- Implement rolling updates with zero downtime
- Use managed database services (AWS RDS, Google Cloud SQL)
- Set up Redis for session management and caching
- Implement horizontal auto-scaling

### 4. Monitoring and Logging

Consider adding:

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus
    # ... configuration

  grafana:
    image: grafana/grafana
    # ... configuration

  loki:
    image: grafana/loki
    # ... configuration
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs [service_name]

# Check container status
docker-compose ps

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### Database connection errors

```bash
# Verify MySQL is running
docker-compose exec mysql mysqladmin ping -h localhost -u root -p

# Check environment variables
docker-compose exec web env | grep DB_

# Verify network connectivity
docker-compose exec web ping mysql
```

### Permission errors

```bash
# Fix upload directory permissions
docker-compose exec web chown -R www-data:www-data /var/www/html/frontend/public/uploads
docker-compose exec web chmod -R 775 /var/www/html/frontend/public/uploads
```

### Port already in use

```bash
# Change port in .env
WEB_PORT=8080
DB_PORT=3308
PHPMYADMIN_PORT=8081

# Restart services
docker-compose down
docker-compose up -d
```

### Out of disk space

```bash
# Clean up unused containers and images
docker system prune -a

# Remove unused volumes (WARNING: deletes data)
docker volume prune
```

## Performance Optimization

### PHP Opcache

Already configured in the Dockerfile. To verify:

```bash
docker-compose exec web php -i | grep opcache
```

### Database Performance

```bash
# Optimize tables
docker-compose exec mysql mysqlcheck -u root -p --optimize yakkai_neri

# Analyze slow queries
docker-compose exec mysql mysql -u root -p -e "SHOW FULL PROCESSLIST;"
```

### Resource Limits

Add resource constraints in `docker-compose.yml`:

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Backup and Restore

### Automated Backup Script

Create `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
docker-compose exec -T mysql mysqldump -u yakkai_user -p$DB_PASS yakkai_neri > "$BACKUP_DIR/db_$DATE.sql"

# Uploads backup
docker cp yakkai_web:/var/www/html/frontend/public/uploads "$BACKUP_DIR/uploads_$DATE"

# Compress
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$BACKUP_DIR/db_$DATE.sql" "$BACKUP_DIR/uploads_$DATE"

# Cleanup
rm -rf "$BACKUP_DIR/db_$DATE.sql" "$BACKUP_DIR/uploads_$DATE"

echo "Backup completed: $BACKUP_DIR/backup_$DATE.tar.gz"
```

## Development Mode

For active development with hot-reload:

```bash
# Use bind mounts instead of COPY (create docker-compose.dev.yml)
services:
  web:
    volumes:
      - ./backend:/var/www/html/backend
      - ./frontend/dist:/var/www/html/frontend/dist
```

Run frontend dev server separately:

```bash
cd frontend
npm run dev
# Access at http://localhost:5173 with hot-reload
```

## Updating the Application

```bash
# Pull latest code
git pull

# Rebuild containers
docker-compose down
docker-compose up -d --build

# Run new migrations if any
docker-compose exec mysql mysql -u yakkai_user -p yakkai_neri < backend/migrations/new_migration.sql
```

## Support and Resources

- Docker Documentation: https://docs.docker.com/
- Docker Compose Reference: https://docs.docker.com/compose/compose-file/
- MySQL Docker Image: https://hub.docker.com/_/mysql
- PHP Docker Image: https://hub.docker.com/_/php

## License

[Your License Here]

---

**Security Notice:** Always review `SECURITY_ANALYSIS.md` before deploying to production. The default configuration is designed for development and requires hardening for production use.
