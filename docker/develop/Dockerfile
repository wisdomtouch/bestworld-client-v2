# Download the image
FROM node:18.19-bullseye AS build
ENV APP_HOME=/srv/app
WORKDIR $APP_HOME

# Install the dependencies
COPY ./package.json ./.yarnrc.yml $APP_HOME/
RUN corepack enable && corepack prepare yarn@stable --activate
RUN yarn workspaces focus --production
RUN yarn add @angular/cli@17.0.1 @angular-devkit/build-angular@17.0.1 --dev

# Copy everything else and build
COPY ./ $APP_HOME/
RUN rm -rf $APP_HOME/src/environments/environment.stag.ts $APP_HOME/src/environments/environment.prod.ts
RUN mv -f $APP_HOME/src/environments/environment.dev.ts $APP_HOME/src/environments/environment.prod.ts
RUN yarn build

# Download the image
FROM nginx:latest AS publish
ENV STATE=develop
ENV PORT_APP=80
ENV PORT_SSH=2222
ENV APP_NAME=ketube-admin
ENV APP_HOME_BUILD=/srv/app

# Set the timezone
ENV TZ=Asia/Bangkok
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Copying compiled code from dist to nginx folder
COPY --from=build $APP_HOME_BUILD/dist/$APP_NAME /usr/share/nginx/html

# Copying nginx config from local to image
COPY --from=build $APP_HOME_BUILD/docker/$STATE/nginx.conf /etc/nginx/conf.d/default.conf

# Start and enable SSH
COPY --from=build $APP_HOME_BUILD/docker/$STATE/ssh-entrypoint.sh /docker-entrypoint.d/ssh-entrypoint.sh
RUN chmod u+x /docker-entrypoint.d/ssh-entrypoint.sh
RUN apt-get update \
    && apt-get install -y --no-install-recommends dialog \
    && apt-get install -y --no-install-recommends openssh-server \
    && echo "root:Docker!" | chpasswd
COPY --from=build $APP_HOME_BUILD/docker/$STATE/sshd_config /etc/ssh/

# Exposing internal port
EXPOSE $PORT_APP $PORT_SSH