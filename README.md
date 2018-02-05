<p align="center">
  <a href="/">
    <img src="https://lh5.ggpht.com/l0BfqyDsAmOzTW7vHHFALJ1xkQjNkIpOVHdvduK2uk1JgPc8ZK-UsPMBdh9RZGCI8gQ=w300" alt="Luddy Symbol Logo" width="72" height="72" />
  </a>

  <h3 align="center">Luddy</h3>
  <p align="center">
    Kinggod
  </p>
</p>

<br>

# Status
[![Dependency Status](https://david-dm.org/Kurosnape/Luddy.svg)](https://david-dm.org/Kurosnape/Luddy) [![Build Status](https://travis-ci.org/Kurosnape/Luddy.svg?branch=master)](https://travis-ci.org/Kurosnape/Luddy)

<p>
  <h4>Table of Contents</h4>

  - [Pre-regs](#pre-regs)
  - [Getting Started](#getting-started)
</p>

# Pre-regs
- Install [Node.js](https://nodejs.org/en/) to run server.
- Install [MongoDB](https://docs.mongodb.com/manual/installation/) to prepare database.
- I strongly recommend using [VSCode](https://code.visualstudio.com/) to develop.

# Getting started
1. Clone this repository: `git clone https://github.com/Kurosnape/Luddy.git <project_name>`
2. Install dependencies: `cd <project_name> && yarn install`
3. Start MongoDB server (you'll probably want another command propmt): `mongod`
4. Build and run the project: `npm run build && npm start`

# About Config
Just to run the server, set the port to 80.

If you have a certificate, Push the certificate path in `import_certs` and set the port to 443.

You can set your own language based on `en.json` settings file. Check `/locales` folder for details :)

Improving contributions or translations is always welcome.

# MongoDB Configure
MongoDB requires a data direcotry to store all data. [See docs (Windows)](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
