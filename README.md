
# LOCAL DEV SETUP

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:

* Node.js - Download & Install Node.js v6.10.3. I would recommend using nvm (Node Version Manager) if possible as it allows you to run multiple versions of node simultaneously. 

* MongoDB - [Download & Install MongoDB Community Server](http://www.mongodb.org/downloads)

* Ruby - [Download & Install Ruby](https://www.ruby-lang.org/en/documentation/installation/)

* Install Bower globally using the command:
	```
	npm install -g bower
	```
		
* Install Gulp globally using the command:
	```
	npm install -g gulp
	npm install -g gulp-cli
	```
		
* Install sass for compiling css using the command: (Make sure you have ruby installed):
	```
	gem install sass
	```
		

## Getting Started

1. Clone repository

2. Navigate to cloned dir and install npm dependencies with the command:
	```
	npm install
	```

3. In a separate shell run MongoDB with the command:
	```
	mongod
	```

4. In the dir after `npm install` completes, start the app with the command:
	```
	gulp
	```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

Explore `config/env/development.js` for development environment configuration options


### Running in Production mode
To run your application with *production* environment configuration, execute gulp as follows:

```
gulp prod
```

## Some early mock ups of the Solution and Issue Pages

![1](http://i.imgur.com/MjB2Waf.png)
![2](http://i.imgur.com/jmyT9cR.png)

