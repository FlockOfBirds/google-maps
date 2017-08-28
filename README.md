[![Build Status](https://travis-ci.org/mendixlabs/google-maps.svg?branch=master)](https://travis-ci.org/mendixlabs/google-maps)
[![Dependency Status](https://david-dm.org/mendixlabs/google-maps.svg)](https://david-dm.org/mendixlabs/google-maps)
[![Dev Dependency Status](https://david-dm.org/mendixlabs/google-maps.svg#info=devDependencies)](https://david-dm.org/mendixlabs/google-maps#info=devDependencies)
[![codecov](https://codecov.io/gh/mendixlabs/google-maps/branch/master/graph/badge.svg)](https://codecov.io/gh/mendixlabs/google-maps)
![badge](https://img.shields.io/badge/mendix-7.5.1-green.svg)

# Google Maps
* Show locations on google maps

## Features
* Show location on a map based on an address
* Show location on a map based on an coordinate
* Show list of both addresses and coordinates on the map
* Data sources Context, Static, XPath or Microflow

## Limitations
Context and static datasource are Offline capable with Mendix data, however still need to be online to see the map.

The widget uses [Google Maps API v3](https://developers.google.com/maps/). So the [Limitations](https://developers.google.com/maps/premium/usage-limits)
from Google applies, especially for geocoding. We even advise geocoding your locations within your
Mendix application and store them for later use as coordinates on the widget.

## Dependencies
Mendix 7.4

## How it Works
When displaying locations, the widget will prioritize coordinates over addresses.In the event that 
the coordinate is not specified, it will use address.
If there are multiple locations, the map will be centered based on default address specified.
However if it is only a single point in the list, the map will center to that point.
When the zoom level is zero (0), then the map will use the bounds zoom.
When the default center is not specified, the map will use the bounds center

## Demo project

[https://googlemaps101.mxapps.io/](https://googlemaps101.mxapps.io/)

![Running google maps widget](/assets/usage.png)

## Usage
![Modeler setup google maps widget](/assets/setup.png)

 ### Data source: Static
 - On the `Data source` option of the `Data source` tab, select the `static` option if its not already selected by default.
 - On the `Static locations` option of the same tab, click new to add `Static locations`.
 
 ### Data source: XPath
 - On the `Data source` option of the `Data source` tab, select the `XPath` option.
 - Specify the `Location entity` and the `XPath` constraint (if any).
 
 ### Data source: Microflow
  - On the `Data source` option of the `Data source` tab, select the `Microflow` option.
  - Specify the `Location entity` and the `Microflow` to retrieve the Map `locations` from (both required).

## Issues, suggestions and feature requests
Please report issues at [https://github.com/mendixlabs/google-maps/issues](https://github.com/mendixlabs/google-maps/issues).


## Development
Prerequisite: Install git, node package manager, webpack CLI, grunt CLI, Karma CLI

To contribute, fork and clone.

    git clone https://github.com/mendixlabs/google-maps.git

The code is in typescript. Use a typescript IDE of your choice, like Visual Studio Code or WebStorm.

To set up the development environment, run:

    npm install

Create a folder named dist in the project root.

Create a Mendix test project in the dist folder and rename its root folder to MxTestProject. Changes to the widget code shall be automatically pushed to this test project. Or get the test project from [https://github.com/mendixlabs/google-maps/releases/latest](https://github.com/mendixlabs/google-maps/releases/latest)

    dist/MxTestProject

To automatically compile, bundle and push code changes to the running test project, run:

    grunt

To run the project unit tests with code coverage, results can be found at dist/testresults/coverage/index.html, run:

    npm test

or run the test continuously during development:

    karma start
