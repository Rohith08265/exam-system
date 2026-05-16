# ExamHub - Production Deployment Guide

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Users (Browser)                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
         ┌───────────┴───────────┐
         │                       │
    ┌────▼────┐           ┌─────▼──────┐
    │  Nginx   │           │  Cloudflare│
    │  Reverse │           │   CDN      │
    │  Proxy   │           │            │
    └────┬────┘           └─────▲──────┘
         │                       │
         │ HTTP                  │
    ┌────▼──────────────────────┐
    │   Frontend (React/Vite)   │
    │   (Nginx Static Serve)    │
    └────┬─────────────────────┬┘
         │                     │
    ┌────▼─────────────────────▼───────┐
    │  Backend API (Express/Node.js)   │
    │  Load Balancer (Optional)        │
    └────┬────────────────────────────┬┘
         │                            │
    ┌────▼────┐              ┌───────▼──────┐
    │ MongoDB  │ (Replica    │  MongoDB     │
    │ Primary  │  Set)       │  Secondary   │
    └──────────┘              └──────────────┘
```

---

## 🏢 Deployment Options

### Option 1: Local Development (Included)
**Best For:** Learning, testing, small teams

```bash
docker-compose up --build
```

### Option 2: Cloud with Docker
**Best For:** Production deployment

Supported platforms:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- Digital Ocean Apps

### Option 3: Traditional Cloud Deployment

#### Backend on Heroku
```bash
# 1. Create Heroku app
heroku create your-examhub-backend

# 2. Add MongoDB Atlas database
heroku addons:create mongolab

# 3. Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set FRONTEND_URL=https://your-frontend.com

# 4. Deploy
git push heroku main
```

#### Frontend on Vercel
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Configure environment
# Set VITE_API_URL to backend URL
```

---

## 🔧 Environment Configuration Templates

### Backend Production (.env)

```env
# ============================================
# ExamHub Backend - Production Configuration
# ============================================

# NODE ENVIRONMENT
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# DATABASE
# MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/dbname
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/examhub?retryWrites=true&w=majority

# SECURITY - CHANGE THESE!
JWT_SECRET=your-super-secret-key-change-this-32-chars-minimum
JWT_EXPIRE=30d
JWT_REFRESH_EXPIRE=7d

# FRONTEND URL (for CORS)
FRONTEND_URL=https://your-domain.com

# EMAIL SERVICE (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# RATE LIMITING
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# LOGGING
LOG_LEVEL=info

# API DOCUMENTATION
API_DOCS_ENABLED=true
API_DOCS_URL=/api/docs
```

### Frontend Production (.env)

```env
# ExamHub Frontend - Production Configuration
VITE_API_URL=https://api.your-domain.com/api
VITE_APP_NAME=ExamHub
```

### Docker Production Compose

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: examhub_mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secure_password_123
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb
    networks:
      - examhub_network
    restart: always
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: examhub_backend
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:secure_password_123@mongodb:27017/examhub?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: https://your-domain.com
      PORT: 5000
    depends_on:
      mongodb:
        condition: service_healthy
    ports:
      - "5000:5000"
    networks:
      - examhub_network
    restart: always
    healthcheck:
      test: curl -f http://localhost:5000/health || exit 1
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: https://api.your-domain.com/api
    container_name: examhub_frontend
    ports:
      - "80:80"
    networks:
      - examhub_network
    depends_on:
      - backend
    restart: always

volumes:
  mongodb_data:
  mongodb_config:

networks:
  examhub_network:
    driver: bridge
```

---

## 🔐 Security Hardening for Production

### 1. SSL/TLS Certificates
```bash
# Using Let's Encrypt with Certbot
sudo apt-get install certbot
sudo certbot certonly --standalone -d your-domain.com

# Certificates at:
# /etc/letsencrypt/live/your-domain.com/cert.pem
# /etc/letsencrypt/live/your-domain.com/privkey.pem
```

### 2. Nginx Configuration
```nginx
# /etc/nginx/sites-available/examhub
upstream backend {
    server backend:5000;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/cert.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    client_max_body_size 10M;

    root /var/www/examhub/frontend/dist;
    index index.html;

    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. Firewall Configuration
```bash
# Open only necessary ports
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS
ufw default deny incoming
ufw default allow outgoing
ufw enable
```

### 4. Database Security
```bash
# Create dedicated MongoDB user
use examhub_prod
db.createUser({
  user: "appuser",
  pwd: "strong_password_here",
  roles: ["readWrite"]
})

# Enable authentication in mongod.conf
security:
  authorization: enabled
```

---

## 📊 Monitoring & Logging

### Application Logging
```javascript
// backend/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
```

### Health Monitoring
```bash
# Add health check endpoint to backend
GET /health

# Response:
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00Z",
  "uptime": 3600,
  "database": "connected"
}
```

### Performance Monitoring
Use services like:
- **DataDog** - APM and monitoring
- **New Relic** - Performance insights
- **Sentry** - Error tracking
- **LogRocket** - Frontend monitoring

---

## 🔄 CI/CD Pipeline Setup

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm ci && npm test
      - run: cd frontend && npm ci && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Deploy commands here
          docker-compose -f docker-compose.prod.yml up -d
```

---

## 📈 Scaling Considerations

### Horizontal Scaling
```yaml
# Multiple backend instances with load balancer
backend1:
  image: examhub_backend:latest
  environment:
    INSTANCE_ID: 1

backend2:
  image: examhub_backend:latest
  environment:
    INSTANCE_ID: 2

backend3:
  image: examhub_backend:latest
  environment:
    INSTANCE_ID: 3

loadbalancer:
  image: nginx:latest
  ports:
    - "5000:5000"
  # Route to backend1, backend2, backend3
```

### Database Optimization
```bash
# Create indexes in production
db.attempts.createIndex({ "student": 1, "exam": 1 })
db.attempts.createIndex({ "exam": 1, "createdAt": -1 })
db.results.createIndex({ "student": 1, "createdAt": -1 })
db.exams.createIndex({ "createdBy": 1, "status": 1 })
```

### Caching Strategy
```javascript
// Add Redis caching for frequently accessed data
const redis = require('redis');
const cache = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// Cache exam listings
cache.get(`exams:published`, (err, data) => {
  if (data) return JSON.parse(data);
  // Fetch from DB and cache
});
```

---

## 🚨 Disaster Recovery

### Backup Strategy
```bash
# Daily MongoDB backup
0 2 * * * mongodump --uri="mongodb+srv://..." --out=/backups/mongo-$(date +\%Y\%m\%d)

# Upload to S3
aws s3 sync /backups s3://your-backup-bucket/mongo-backups
```

### Recovery Procedure
```bash
# 1. List backups
aws s3 ls s3://your-backup-bucket/mongo-backups

# 2. Download backup
aws s3 sync s3://your-backup-bucket/mongo-backups/mongo-20240115 ./recovery

# 3. Restore to database
mongorestore --uri="mongodb+srv://..." ./recovery/examhub
```

---

## ✅ Pre-Launch Checklist

### Security
- [ ] JWT secrets changed and stored securely (use .env)
- [ ] SSL/TLS certificates installed
- [ ] Database passwords changed from defaults
- [ ] Firewall configured
- [ ] CORS set to production domain only
- [ ] Rate limiting configured
- [ ] Security headers enabled (Helmet)

### Performance
- [ ] Database indexes created
- [ ] Frontend optimized (minified, gzipped)
- [ ] Backend response times acceptable (<500ms)
- [ ] Static assets cached appropriately
- [ ] Database connection pooling configured
- [ ] CDN configured for static assets

### Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Application logging enabled
- [ ] Health check endpoints working
- [ ] Uptime monitoring configured
- [ ] Performance monitoring enabled
- [ ] Alert thresholds set

### Data
- [ ] Database backup plan in place
- [ ] Backup tested and verified
- [ ] Data retention policy defined
- [ ] GDPR compliance reviewed
- [ ] Privacy policy created

### Operations
- [ ] Deployment process documented
- [ ] Rollback procedure tested
- [ ] Incident response plan created
- [ ] Team trained on system
- [ ] Documentation complete
- [ ] Support contact info configured

---

## 🆘 Troubleshooting Production Issues

### Application won't start
```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Database connection failed → Check MONGODB_URI
# 2. Port in use → Change PORT in .env
# 3. Missing environment variable → Check .env file
```

### Slow API responses
```bash
# 1. Check database query performance
db.attempts.find().explain("executionStats")

# 2. Add missing indexes
db.attempts.createIndex({ "exam": 1, "createdAt": -1 })

# 3. Implement caching
# See Caching Strategy above
```

### High memory usage
```bash
# 1. Enable production mode in Node.js
NODE_ENV=production

# 2. Check for memory leaks
# Use clinic.js or heapdump

# 3. Implement connection pooling
# MongoDB connection pool defaults to 100
```

---

## 📞 Support Resources

- **Deployment Docs**: https://docs.docker.com/compose/compose-file/compose-file-v3/
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Nginx**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/

---

**Deployment Version:** 1.0  
**Last Updated:** January 2024  
**Supported by:** ExamHub Team
