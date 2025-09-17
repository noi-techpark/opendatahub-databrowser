<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# Data Browser for the Open Data Hub

[![REUSE Compliance](https://github.com/noi-techpark/it.bz.opendatahub.databrowser/actions/workflows/reuse.yml/badge.svg)](https://github.com/noi-techpark/odh-docs/wiki/REUSE#badges)

This is the repository for the Open Data Hub Data Browser.

## Table of Contents

- [Getting started](#getting-started)
- [Build for production](#build-for-production)
- [Docker environment](#docker-environment)
- [Information](#information)

## Getting started

These instructions will get you a copy of this repository and prepare it for development of the Data Browser.
\
### Prerequisites

To build the projects in the repository, the following prerequisites must be met:

- Node.js, at least v14.16 or v16 LTS (see [https://nodejs.org/en/about/releases/](https://nodejs.org/en/about/releases/))

### Installing

Get a copy of the repository, e.g. by cloning it from the following location:

```bash
git clone https://github.com/noi-techpark/opendatahub-databrowser
```

Change into the `databrowser` directory:

```bash
cd opendatahub-databrowser/databrowser
```

Install the dependencies:

```bash
npm install
```

Copy the file .env.example to .env and adjust the configuration parameters if required.

Start the development server:

```bash
npm run dev
```

On successful start, the Data Browser application can be found at [http://localhost:3000](http://localhost:3000).

## Build for production

> Before proceeding, please ensure that you are in the `databrowser` directory.

Build the production version:

```bash
npm run build
```

The result, found in the `./dist` folder, can be deployed to a web server.

Launch local production server:

```bash
npm run start
```

## Docker environment

> Before proceeding, please ensure that you are in the `databrowser` directory.

For the project a Docker environment is already prepared and ready to use with all necessary prerequisites.

These Docker containers are the same as used by the continuous integration servers.

In order to use the Docker environment, you must have [Docker](https://docs.docker.com/install/) installed locally on your machine, together with [Docker Compose](https://docs.docker.com/compose/).

### Start and stop the containers

Before start working you have to start the Docker containers:

```bash
docker-compose up --build --detach
```

After finished working you can stop the Docker containers:

```bash
docker-compose stop
```

### Running commands inside the container

When the containers are running, you can execute any command inside the environment. Just replace the dots `...` in the following example with the command you wish to execute:

```bash
docker-compose exec node /bin/bash -c "..."
```

Some examples are:

```bash
docker-compose exec node /bin/bash -c "npm install"

# or

docker-compose exec node /bin/bash -c "npm run dev"

# or

docker-compose exec node /bin/bash -c "npm run build"
```

## Information

### Support

For support, please contact [Christian Gapp](https://github.com/gappc) or
[NOI Techpark Südtirol - Alto Adige](https://noi.bz.it/en).

### Contributing

Please take a look at the [Contributor Guidelines](https://github.com/noi-techpark/odh-docs/wiki/Contributor-Guidelines%3A-Getting-started).

You can find an introduction on how to start developing in the [contribute-to-development](./doc/contribute-to-development.md) and [guideline](./databrowser/guideline.md) files.

### Versioning

This project uses [SemVer](https://semver.org/) for versioning. For the versions available,
see the [tags on this repository](https://github.com/noi-techpark/it.bz.opendatahub.databrowser/tags).

### License

The code in this project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE license, Version 3. See the LICENSE file for more information.

### Reuse

This project aims to be [REUSE](https://reuse.software) compliant. All files contained in the repository either have to be mentioned in the [dep5](.reuse/dep5) file or preferably contain a header containing SPDX copyright and licensing information.

The project is checked for licensing and copyright information before every commit by a pre-commit hook if the [reuse-helper-tool](https://github.com/fsfe/reuse-tool) is installed as well as in the github CI which will fail if REUSE standards are not satisfied. Instructions for the installation of the helper tool [here](https://github.com/fsfe/reuse-tool#install). If you want to use the helper tool via `pipx run` consider setting an alias for the command `reuse` to enable the pre commit hook to execute the lint.

```bash
alias reuse="pipx run reuse"
```

For more information on how to make new files REUSE compliant check the project [guidline](databrowser/guideline.md).

### Authors

- **Christian Gapp** - _Initial work_ - [gappc](https://github.com/gappc)
- **AboutBits** - _Initial work_ - [AboutBits](https://github.com/aboutbits)
- **FlashBeing** - _Lots of contributions_ [FlashBeing](https://flashbeing.com/)
- **NOI Support Team** - _Configurations and tests_

### Acknowledgements

- [NOI Techpark Südtirol - Alto Adige](https://noi.bz.it/en)
