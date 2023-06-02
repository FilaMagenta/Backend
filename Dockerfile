FROM alpine

# Create app directory
WORKDIR /usr/src/app

# Install NodeJS and npm
RUN apk add --update nodejs npm

# Install bcrypt dependencies
RUN apk --no-cache add --virtual builds-deps build-base python

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 80

CMD [ "node", "index.mjs" ]