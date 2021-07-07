[![Build Status](https://travis-ci.org/mendixlabs/google-maps.svg?branch=master)](https://travis-ci.org/mendixlabs/google-maps)
[![Dependency Status](https://david-dm.org/mendixlabs/google-maps.svg)](https://david-dm.org/mendixlabs/google-maps)
[![Dev Dependency Status](https://david-dm.org/mendixlabs/google-maps.svg#info=devDependencies)](https://david-dm.org/mendixlabs/google-maps#info=devDependencies)
[![codecov](https://codecov.io/gh/mendixlabs/google-maps/branch/master/graph/badge.svg)](https://codecov.io/gh/mendixlabs/google-maps)
![badge](https://img.shields.io/badge/mendix-7.9.0-green.svg)

# Google Maps
* Show locations on google maps

## Features
* Show location on a map based on an address
* Show location on a map based on an coordinate
* Show list of both addresses and coordinates on the map
* Data sources Context, Static, XPath or Microflow
* Customize the display of the marker. If the marker can not be found from the custom markers. The widget will use
  the specified custom markers else it will use the widget bundled marker.
* Supports actions when a marker is clicked:
    * Open page
    * Call microflow
    * Call nanoflow

## Limitations
Context and static datasource are Offline capable with Mendix data, however still need to be online to see the map.

The widget uses [Google Maps API v3](https://developers.google.com/maps/). So the [Limitations](https://developers.google.com/maps/premium/usage-limits)
from Google applies, especially for geocoding. We even advise geocoding your locations within your
Mendix application and store them for later use as coordinates on the widget.

## Dependencies
Mendix 7.13.1

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

 ### Appearance
  - It is used to configure how the map responsively looks in relation to the container it is placed in.
 
 ### Custom markers
   - It is used to configure how the marker icon should be look. Due to the limitation of Mendix. The markers are created
   based on enumeration. An enumeration containing the name and caption of the markers should be created within your project 
   and that enumeration assigned to the `Location entity`. From the `Custom markers` tab, the enumeration key and image is
   then specified in the `Marker images`

## Issues, suggestions and feature requests
Please report issues at [https://github.com/mendixlabs/google-maps/issues](https://github.com/mendixlabs/google-maps/issues).


## Development and contribution
Please follow [development guide](/development.md).
