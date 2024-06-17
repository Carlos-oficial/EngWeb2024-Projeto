# Use the official Node.js image from the Docker Hub.
FROM node:18-alpine

# Set the working directory in the container.
WORKDIR /app

# Copy the package.json and package-lock.json files to the container.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code to the container.
COPY . .

# Expose port 3000 for the application.
EXPOSE 3000

# Start the Next.js application.
CMD ["npm", "run", "dev"]
