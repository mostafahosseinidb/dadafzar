# Multi-stage build for React application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /models/ { \
        alias /usr/share/nginx/html/models/; \
        add_header Access-Control-Allow-Origin *; \
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS"; \
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range"; \
    } \
    location /fonts/ { \
        alias /usr/share/nginx/html/fonts/; \
        add_header Access-Control-Allow-Origin *; \
    } \
    location /image/ { \
        alias /usr/share/nginx/html/image/; \
        add_header Access-Control-Allow-Origin *; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
