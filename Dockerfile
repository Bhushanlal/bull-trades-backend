# Step 1: Use an official Node.js image as a base
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of the application files
COPY . .

# Step 5: Expose the port the app will run on
EXPOSE 3000

# Step 6: Start the server
CMD ["node", "app.js"]
