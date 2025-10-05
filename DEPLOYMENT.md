# Evaid Deployment Guide

This guide covers deploying the Evaid travel safety application to production environments.

## Deployment Options

### 1. Cloud Platforms

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create apps
heroku create evaid-backend
heroku create evaid-frontend

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri --app evaid-backend
heroku config:set JWT_SECRET=your-jwt-secret --app evaid-backend
# ... add other environment variables

# Deploy
git subtree push --prefix server heroku main
git subtree push --prefix client heroku main
```

#### Vercel (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd client
vercel --prod
```

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

### 2. VPS/Server Deployment

#### Using PM2
```bash
# Install PM2
npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start server/index.js --name evaid-backend
pm2 start "serve -s client/build" --name evaid-frontend

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Using Docker
```dockerfile
# Dockerfile for backend
FROM node:16-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ .
EXPOSE 5000
CMD ["npm", "start"]
```

```dockerfile
# Dockerfile for frontend
FROM node:16-alpine as build
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Environment-Specific Configurations

#### Production Environment Variables

**Server (.env.production)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-jwt-secret
GOOGLE_MAPS_API_KEY=your-production-maps-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-email-password
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
CORS_ORIGIN=https://your-frontend-domain.com
```

**Client (.env.production)**
```env
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_SOCKET_URL=https://your-backend-domain.com
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use secure, random values for secrets
- Rotate secrets regularly
- Use different secrets for different environments

### 2. Database Security
- Use strong authentication for MongoDB
- Enable SSL/TLS for database connections
- Restrict database access by IP
- Regular backups and monitoring

### 3. API Security
- Implement rate limiting
- Use HTTPS in production
- Validate all inputs
- Implement proper CORS policies

### 4. Firebase Security
- Configure Firebase security rules
- Use Firebase App Check for additional security
- Monitor authentication events
- Implement proper user permissions

## Performance Optimization

### 1. Frontend Optimization
```javascript
// Code splitting
const MapPage = React.lazy(() => import('./pages/MapPage'));

// Image optimization
import { LazyLoadImage } from 'react-lazy-load-image-component';

// Bundle analysis
npm install --save-dev webpack-bundle-analyzer
```

### 2. Backend Optimization
```javascript
// Compression
app.use(compression());

// Caching
app.use(express.static('public', { maxAge: '1d' }));

// Database indexing
userSchema.index({ email: 1 });
journeySchema.index({ userId: 1, status: 1 });
```

### 3. Database Optimization
- Create appropriate indexes
- Use connection pooling
- Implement query optimization
- Monitor slow queries

## Monitoring and Logging

### 1. Application Monitoring
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### 2. Error Tracking
```javascript
// Sentry integration
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### 3. Logging
```javascript
// Winston logger
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## SSL/HTTPS Setup

### 1. Let's Encrypt
```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Backup and Recovery

### 1. Database Backups
```bash
# MongoDB backup
mongodump --uri="mongodb://your-connection-string" --out=backup/

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://your-connection-string" --out=backup/$DATE
```

### 2. Application Backups
```bash
# Code backup
tar -czf evaid-backup-$(date +%Y%m%d).tar.gz /path/to/evaid

# Environment backup
cp .env .env.backup
```

## Scaling Considerations

### 1. Horizontal Scaling
- Use load balancers
- Implement session management
- Use Redis for session storage
- Database sharding

### 2. Vertical Scaling
- Increase server resources
- Optimize database queries
- Use CDN for static assets
- Implement caching strategies

## Maintenance

### 1. Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Update API keys regularly
- Test updates in staging

### 2. Performance Monitoring
- Monitor response times
- Track error rates
- Monitor resource usage
- Set up alerts

### 3. User Support
- Monitor user feedback
- Track usage analytics
- Implement feature flags
- A/B testing

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Runtime Errors**
   - Check environment variables
   - Verify database connections
   - Monitor application logs

3. **Performance Issues**
   - Check database query performance
   - Monitor memory usage
   - Optimize images and assets

### Support Resources
- Application logs
- Server monitoring tools
- Database performance metrics
- User feedback and analytics

## Conclusion

This deployment guide provides comprehensive instructions for deploying Evaid to various platforms. Choose the deployment method that best fits your needs and infrastructure requirements.

For additional support, refer to the platform-specific documentation or contact the development team.
