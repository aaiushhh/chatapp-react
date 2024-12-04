# Use Node.js LTS image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
