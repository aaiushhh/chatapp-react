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

# Build the frontend
RUN npm run build

# Install static server
RUN npm install -g serve

# Expose the port
EXPOSE 5173

# Start the app on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
