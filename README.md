# node sample app


# Table of Contents
* [Installation](#installation)
* [Tools](#tools)
* [File Structure](#files)
* [Team Members](#team-members)
 
# <a name="installation"></a>Installation

**Please have a local postgres instance running**

`git clone https://github.com/ecasilla/sparkdigital`  

`cp .env.template .env`

`npm install`  

`npm start`


# <a name="tools"></a>Tools

* Typescript
* Joi (request/contract validation)
* Gulp (build tool) 



# <a name="files"></a>Folder Structure

```
├── README.md
├── accessories
│   ├── building-log.ts
│   ├── formatting-log.ts
│   ├── lint-log.ts
│   ├── linting-log.ts
│   ├── pre-commit-log.ts
│   ├── prepublish-log.ts
│   ├── real-build-log.ts
│   ├── test-log.ts
│   └── test-watch-log.ts
├── gulpfile.ts
├── package-lock.json
├── package.json
├── src
│   ├── api
│   │   ├── movies
│   │   │   ├── index.ts
│   │   │   ├── movies.ctrl.ts
│   │   │   ├── movies.model.ts
│   │   │   └── movies.validation.ts
│   │   └── users
│   │       ├── index.ts
│   │       ├── users.ctrl.ts
│   │       ├── users.model.ts
│   │       └── users.validation.ts
│   ├── auth
│   │   ├── auth.service.ts
│   │   ├── index.ts
│   │   └── local
│   │       ├── index.ts
│   │       └── passport.ts
│   ├── components
│   │   ├── errors
│   │   │   └── index.ts
│   │   └── middleware
│   │       └── requestId.ts
│   ├── config
│   │   ├── constants.ts
│   │   ├── express.ts
│   │   └── index.ts
│   ├── db
│   │   └── index.ts
│   ├── index.ts
│   ├── routes.ts
│   ├── utils
│   │   ├── index.ts
│   │   └── logger.ts
│   └── views
│       ├── 401.html
│       ├── 404.html
│       ├── 500.html
│       └── layout.ejs
├── tsconfig.json
├── tslint.json
└── typings
    ├── lme.d.ts
    └── typings.d.ts
```

## Auth Token
Create & Login Endpoints return an Auth Token.
You will need to send that token as an http header for subsequent requests.

**HTTP Header**
`Authorization Bearer ...token`

# UnAuth ROUTES
**METHOD**|**ROUTE**
:-----:|:-----:
POST|/api/v1/users/
POST|/auth/login/

# Auth ROUTES
**METHOD**|**ROUTE**
:-----:|:-----:
GET|/api/v1/movies/
GET|/api/v1/movies/:id
POST|/api/v1/movies/
PUT|/api/v1/movies/:id
DELETE|/api/v1/movies/:id
GET|/api/v1/users/:id

# Admin ROUTES
**METHOD**|**ROUTE**
:-----:|:-----:
GET|/api/v1/users/
DELETE|/api/v1/users/:id


# <a name="team-members"></a>Team Members
* "Ernie Casilla" <ecasilla@gmail.com>

