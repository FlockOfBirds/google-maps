## How it Works
When displaying locations, the widget will prioritize coordinates over addresses.  
If coordinates are not specified, it will use the provided address otherwise it will center to the default location  
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
- It is used to configure the map responsive appearance in relation to the container it is placed in.

### Custom markers
- It is used to configure how the marker icon should be look. Due to the limitation of Mendix. The markers are created
based on enumeration. An enumeration containing the name and caption of the markers should be created within your project 
and that enumeration assigned to the `Location entity`. From the `Custom markers` tab, the enumeration key and image is
then specified in the `Marker images`  
![Google maps markers](/assets/google-maps-marker.png)

## Issues, suggestions and feature requests
Please report issues at [https://github.com/mendixlabs/google-maps/issues](https://github.com/mendixlabs/google-maps/issues).

