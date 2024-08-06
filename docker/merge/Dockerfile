# Download the image
FROM node:18.19-bullseye AS build
ENV APP_HOME=/srv/app/
WORKDIR $APP_HOME

COPY ./package.json ./.yarnrc.yml $APP_HOME

# Set the timezone
RUN echo 'tzdata tzdata/Areas select Asia' | debconf-set-selections
RUN echo 'tzdata tzdata/Zones/Asia select Bangkok' | debconf-set-selections
RUN DEBIAN_FRONTEND="noninteractive" apt install -y tzdata

# Install yarn package manager
RUN corepack enable && corepack prepare yarn@stable --activate

# Install the depenendencies
RUN yarn install

# Copy everything else and build
COPY ./ $APP_HOME

# Build project
RUN yarn build