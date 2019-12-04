# Use Node v8.9.0 LTS
FROM node:carbon

# Setup app working directory
WORKDIR /Desktop/boot_camp/projects/search-engine

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy sourcecode
COPY . .

# Start app
CMD [ "npm", "start" ]