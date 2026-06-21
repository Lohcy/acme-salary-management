# Use the lightweight Alpine Linux version of Node 22
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Clean install of dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the port your Express app uses
EXPOSE 5001

# Run the seed script to generate the 10,000 records, then start the server
CMD ["sh", "-c", "npm run seed && npm start"]