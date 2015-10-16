## [preorda.in Client](https://preorda.in)


* [Polymer](http://polymer-project.org), [Paper](https://elements.polymer-project.org/browse?package=paper-elements) and [Iron](https://elements.polymer-project.org/browse?package=iron-elements) elements
* [Material Design](http://www.google.com/design/spec/material-design/introduction.html) layout 
* Routing with [Page.js](https://visionmedia.github.io/page.js/)

### Install dependencies

#### Quick-start

With Node.js installed, run the following one liner from the root of the client:

```sh
npm install -g gulp bower && npm install && bower install
```

### Development workflow

#### Serve / watch

```sh
gulp serve
```

This outputs an IP address you can use to locally test and another that can be used on devices connected to your network. This runs over https so you will get a certificate error, that's normal.

Babel will fail to work correctly so you have to refresh manually every time js is changed. It's a hassle, I need to sink more time into fixing it.

```sh
gulp serve:dist
```

Build and optimize the client as it would be for a full production run; serve the result as gulp serve does. No files are watched due to the low speed of this pipeline.

#### Build & Vulcanize

```sh
gulp
```

Build and optimize the current project, ready for deployment. This includes linting as well as vulcanization, image, script, stylesheet and HTML optimization and minification.


## Backend targeting

The backend is designed to match the api and data directories provided by beta.perfectlag.me. In theory, retargeting to a new backend that exposes a similar api would be doable.

## Dependency Management

preorda.in uses [Bower](http://bower.io) for package management. Life is a lot easier when you can have sane dependencies.

## Attribution

[Polymer Starter Kit](https://github.com/PolymerElements/polymer-starter-kit) is the base for this project. It provides sane defaults and examples of polymer. Yes, this readme is the hollowed out remains of the Starter Kit readme.