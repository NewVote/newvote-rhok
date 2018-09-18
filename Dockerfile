FROM node:8.9.3-alpine

# Install gem sass for  grunt-contrib-sass
RUN apk update && apk add \
	build-base \
	ruby \
	ruby-dev \
	git \
&& gem update --system --no-document\
&& gem install sass --no-document\
&& rm -rf /var/lib/apt/lists/*

WORKDIR /home/mean

# Install Mean.JS Prerequisites
RUN npm install -g bower gulp gulp-cli

# Install Mean.JS packages
ADD package.json /home/mean/package.json
ADD .bowerrc /home/mean/.bowerrc
ADD bower.json /home/mean/bower.json
RUN npm install --production && bower install --config.interactive=false --allow-root

ADD . /home/mean

# Set development environment as default
ENV NODE_ENV production

RUN npm rebuild node-sass --force

# Port 3000 for dev server
# Port 8443 for prod server
# Port 35729 for livereload
EXPOSE 8443
CMD ["sh", "-c", "gulp prod"]
