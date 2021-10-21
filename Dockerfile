FROM node:16-alpine3.11

# Create a working directory inside the container
ENV APP_HOME /usr/src/app
WORKDIR ${APP_HOME}
COPY . ./

# install dependencies
RUN npm install

CMD npm run dev
