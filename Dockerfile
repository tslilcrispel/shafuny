# Use the latest Node.js image as the base
FROM node:latest

# Copy package.json and package-lock.json (if present) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your application will listen on (replace with your actual port)
EXPOSE 8080

# Start the application
CMD ["npm", "run", "dev"]