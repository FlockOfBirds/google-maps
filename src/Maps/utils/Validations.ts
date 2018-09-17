import { Container } from "./namespace";

export const validateLocationProps = <T extends Partial<Container.MapsContainerProps>> (locationData: T): string => {
    const { locations, zoomLevel, autoZoom, apiToken, mapProvider, markerImages } = locationData;
    const errorMessage: string[] = [];
    if (!autoZoom && (zoomLevel && zoomLevel < 2)) {
        errorMessage.push("Zoom Level should be greater than one");
    }
    if (!(mapProvider === "openStreet") && !apiToken) {
        errorMessage.push(`An api token for ${mapProvider} is required`);
    }
    if (locations && locations.length) {
        locations.forEach((location, index) => {
            if (location.dataSourceType && location.dataSourceType !== "static") {
                if (!(location.latitudeAttribute && location.longitudeAttribute)) {
                    errorMessage.push(`The Latitude attribute and longitude attribute are required for data source
                    ${locations[index].dataSourceType} at location ${index + 1}`);
                }
            } else if (!(location.staticLatitude && location.staticLongitude)) {
                errorMessage.push(`Invalid static locations. Latitude and longitude are required at location ${index + 1}`);
            }
            if (location.markerImage === "enumImage" && !(markerImages && markerImages.length)) {
                errorMessage.push(`Marker images are required for image attribute at location ${index + 1}`);
            }
            if (location.dataSourceType === "microflow") {
                if (!location.dataSourceMicroflow) {
                    errorMessage.push(`A Microflow is required for Data source Microflow at location ${index + 1}`);
                }
            }
        });
    }

    return errorMessage.join(", ");
};

export const validateLocations = (location: Container.Location): Promise<Container.Location> => new Promise((resolve, reject) => {
    if (validLocation(location)) {
        resolve(location);
    } else {
        reject(`invalid location: latitude ${location.longitude}, longitude ${location.longitude}`);
    }
});

export const validLocation = (location: Container.Location) => {
    const { latitude: lat, longitude: lng } = location;

    return typeof lat === "number" && typeof lng === "number"
    && lat <= 90 && lat >= -90
    && lng <= 180 && lng >= -180
    && !(lat === 0 && lng === 0);
};
