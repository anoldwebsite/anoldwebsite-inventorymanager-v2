# Use an official Node.js runtime as a parent image
FROM node:18-alpine


# Set the working directory in the container
WORKDIR /app


# Copy the package.json and package-lock.json files
COPY package*.json ./


# Install dependencies
RUN npm install


# Copy the rest of the application code
COPY . .


# Generate Prisma Client for the correct environment
RUN npx prisma generate


# Build the Next.js application
RUN npm run build


# Expose the port the app runs on
EXPOSE 3001


# Start the application
CMD ["npm", "start"]
