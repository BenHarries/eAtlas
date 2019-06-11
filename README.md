eAtlas
================

<img width="100%" alt="Screenshot 2019-06-11 at 17 22 02" src="https://user-images.githubusercontent.com/408568/59289239-7b54f500-8c6d-11e9-8419-7eeae5c795d7.png">

Currently this is just a “WIP” as we explore and gather requirements of
the project. There are some
[notes](https://github.com/layik/eAtlas/blob/master/notes/project_planning.md)
to read.

This is a [geopumber](https://github.com/ATFutures/geoplumber) app. That
means it is an R powered backend API (think Flask in Python) and a
ReactJS front end.

To build, from an R console:

``` r
library(geoplumber)
gp_build()
```

Before you run the app: \* you will need some preprocessed data, an RDS
called “ac\_joined\_wy\_2009-2017.Rds”. \* you will need a Mapbox API
key (will see if we can remove this) in `.env.local` file using variable
name: `REACT_APP_MAPBOX_ACCESS_TOKEN = 'API_KEY'`

Then you can run

``` r
library(geoplumber)
gp_plumb()
```

visit `localhost:8000`

or just run the front using: `npm i & npm start`

## deploy with docker

Repo contains Dockerfile for production.
