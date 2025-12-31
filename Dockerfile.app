# Use official Node 20 image
FROM node:20-slim

# Create app directory
WORKDIR /app/inso-code-service

# Install dependencies based on package.json (cached unless changed)
COPY package*.json ./

RUN npm install --legacy-peer-deps
RUN npm install -g nodemon


# Copy rest of app
COPY . .

# Expose app port
EXPOSE 5100

# Start the application
CMD ["nodemon", "index.js"]
