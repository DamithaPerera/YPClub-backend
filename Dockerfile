# Use official Node.js image
FROM node:18

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose port (matches what your Node.js app uses)
EXPOSE 3001

# Command to start the app
CMD ["npm", "run", "start"]
