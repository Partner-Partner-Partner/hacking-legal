# Use the official Node.js image as a parent image
FROM node:23-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies with legacy peer deps flag to bypass React version conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]

