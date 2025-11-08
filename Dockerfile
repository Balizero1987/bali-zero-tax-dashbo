# syntax = docker/dockerfile:1

# Use pre-built dist/ directory - no build step needed
FROM nginx

# Copy pre-built application
COPY dist /usr/share/nginx/html

# Start the server by default, this can be overwritten at runtime
EXPOSE 80
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
