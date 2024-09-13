# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Set the timezone
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Copy the package.json and package-lock.json files
COPY backend /app

# Install the dependencies
RUN npm install

# Expose the port your app will run on
EXPOSE 3889

# Command to run the app
CMD ["npm", "start"]