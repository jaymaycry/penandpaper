# penandpaper [![Build Status](https://travis-ci.org/jaymaycry/penandpaper.svg?branch=dev)](https://travis-ci.org/jaymaycry/penandpaper)

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 4.1.2.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [Docker](https://www.docker.com/) - Keep a running mongo daemon with `docker-compose up`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `docker-compose up` in a separate shell to keep an instance of the MongoDB Daemon in a Dockercontainer running

3. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `gulp build` for building and `gulp serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.
