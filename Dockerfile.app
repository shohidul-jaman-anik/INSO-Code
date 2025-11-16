# Use official Node 18 image
FROM node:18-alpine

# Create app dir
WORKDIR /app/inso-code-service

# Copy dependency manifests first (better cache)
COPY package*.json ./

# Install dependencies
# For dev, we will install everything (so nodemon in devDependencies will be available)
RUN npm install --legacy-peer-deps

# Copy rest of app
COPY . .

# Expose app port
EXPOSE 5100

# Use npm script (recommended). Make sure package.json has "dev": "nodemon index.js"
CMD ["npm", "run", "dev"]
