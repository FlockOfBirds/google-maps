import { Component, createElement } from "react";
import { Location, Map, heightUnitType, widthUnitType } from "./Map";
import { Alert } from "./Alert";

interface WrapperProps {
    "class"?: string;
    mxObject?: mendix.lib.MxObject;
    style: string;
}

interface GoogleMapContainerProps extends WrapperProps {
    apiKey: string;
    autoZoom: boolean;
    dataSource: DataSource;
    dataSourceMicroflow: string;
    defaultCenterAddress: string;
    entityConstraint: string;
    height: number;
    heightUnit: heightUnitType;
    optionDrag: boolean;
    optionMapControl: boolean;
    optionScroll: boolean;
    optionStreetView: boolean;
    optionZoomControl: boolean;
    locationsEntity: string;
    addressAttribute: string;
    latitudeAttribute: string;
    longitudeAttribute: string;
    staticLocations: StaticLocation[];
    width: number;
    widthUnit: widthUnitType;
    zoomLevel: number;
}

interface StaticLocation {
    address: string;
    latitude: string;
    longitude: string;
}

type DataSource = "static" | "context" | "XPath" | "microflow";

class GoogleMapContainer extends Component<GoogleMapContainerProps, { alertMessage?: string, locations: Location[] }> {
    private subscriptionHandles: number[];

    constructor(props: GoogleMapContainerProps) {
        super(props);

        const alertMessage = GoogleMapContainer.validateProps(props);
        this.subscriptionHandles = [];
        this.state = { alertMessage, locations: [] };
        this.subscribe(this.props.mxObject);
    }

    render() {
        if (this.state.alertMessage) {
            return createElement(Alert, {
                bootstrapStyle: "danger",
                className: "widget-google-maps-alert",
                message: this.state.alertMessage
            });
        } else {
            return createElement(Map, {
                apiKey: this.props.apiKey,
                autoZoom: this.props.autoZoom,
                className: this.props.class,
                defaultCenterAddress: this.props.defaultCenterAddress,
                height: this.props.height,
                heightUnit: this.props.heightUnit,
                locations: this.state.locations,
                optionDrag: this.props.optionDrag,
                optionMapControl: this.props.optionMapControl,
                optionScroll: this.props.optionScroll,
                optionStreetView: this.props.optionStreetView,
                optionZoomControl: this.props.optionZoomControl,
                style: GoogleMapContainer.parseStyle(this.props.style),
                width: this.props.width,
                widthUnit: this.props.widthUnit,
                zoomLevel: this.props.zoomLevel
            });
        }
    }

    componentWillReceiveProps(nextProps: GoogleMapContainerProps) {
        this.subscribe(nextProps.mxObject);
        this.fetchData(nextProps.mxObject);
    }

    componentDidMount() {
        if (!this.state.alertMessage) this.fetchData(this.props.mxObject);
    }

    componentWillUnmount() {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
    }

    public static validateProps(props: GoogleMapContainerProps) {
        let message = "";
        if (props.dataSource === "static" && !props.staticLocations.length) {
            message = "At least one static location is required for 'Data source 'Static'";
        }
        if (props.dataSource === "static") {
            const invalidLocations = props.staticLocations.filter(location =>
                !location.address && !(location.latitude && location.longitude)
            );
            if (invalidLocations.length > 0) {
                message = "The 'Address' or 'Latitude' and 'Longitude' "
                    + "is required for this 'Static' data source";
            }
        }
        if (props.dataSource === "XPath" && !props.locationsEntity) {
            message = "The 'Locations entity' is required for 'Data source' 'XPath'";
        }
        if (props.dataSource === "microflow" && !props.dataSourceMicroflow) {
            message = "A 'Microflow' is required for 'Data source' 'Microflow'";
        }
        if (props.dataSource !== "static" && (!props.addressAttribute &&
            !(props.longitudeAttribute && props.latitudeAttribute))) {
            message = "The 'Address attribute' or 'Latitude Attribute' and 'Longitude attribute' "
                + "is required for this data source";
        }
        if (!props.autoZoom && props.zoomLevel < 2 ) {
            message = "Zoom level must be greater than 1";
        }

        return message;
    }

    // Mendix does not support negative and decimal number as static inputs, so they are strings.
    public static parseStaticLocations(locations: StaticLocation[]): Location[] {
        return locations.map(location => ({
            address: location.address,
            latitude: location.latitude.trim() !== "" ? Number(location.latitude) : undefined,
            longitude: location.longitude.trim() !== "" ? Number(location.longitude) : undefined
        }));
    }

    private subscribe(contextObject?: mendix.lib.MxObject) {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
        this.subscriptionHandles = [];

        if (contextObject) {
            this.subscriptionHandles.push(window.mx.data.subscribe({
                callback: () => this.fetchData(contextObject),
                guid: contextObject.getGuid()
            }));
            [
                this.props.addressAttribute,
                this.props.latitudeAttribute,
                this.props.longitudeAttribute
            ].forEach(attr => this.subscriptionHandles.push(window.mx.data.subscribe({
                attr,
                callback: () => this.fetchData(contextObject), guid: contextObject.getGuid()
            })));
        }
    }

    private fetchData(contextObject?: mendix.lib.MxObject) {
        if (this.props.dataSource === "static") {
            this.setState({ locations: GoogleMapContainer.parseStaticLocations(this.props.staticLocations) });
        } else if (this.props.dataSource === "context") {
            this.fetchLocationsByContext(contextObject);
        } else if (this.props.dataSource === "XPath" && this.props.locationsEntity) {
            const guid = contextObject ? contextObject.getGuid() : "";
            this.fetchLocationsByXPath(guid);
        } else if (this.props.dataSource === "microflow" && this.props.dataSourceMicroflow) {
            this.fetchLocationsByMicroflow(this.props.dataSourceMicroflow, contextObject);
        }
    }

    private fetchLocationsByContext(contextObject?: mendix.lib.MxObject) {
        if (contextObject) {
            this.setLocationsFromMxObjects([ contextObject ]);
        }
    }

    private fetchLocationsByXPath(contextGuid: string) {
        const { entityConstraint } = this.props;
        const requiresContext = entityConstraint && entityConstraint.indexOf("[%CurrentObject%]") > -1;
        if (!contextGuid && requiresContext) {
            this.setState({ locations: [] });
            return;
        }

        const constraint = entityConstraint ? entityConstraint.replace("[%CurrentObject%]", contextGuid) : "";
        const xpath = `//${this.props.locationsEntity}${constraint}`;

        window.mx.data.get({
            callback: mxObjects => this.setLocationsFromMxObjects(mxObjects),
            error: error =>
                this.setState({
                    alertMessage: `An error occurred while retrieving locations: ${error} constraint ` + xpath,
                    locations: []
                }),
            xpath
        });
    }

    private fetchLocationsByMicroflow(microflow: string, contextObject?: mendix.lib.MxObject) {
        if (microflow) {
            window.mx.ui.action(microflow, {
                callback: (mxObjects: mendix.lib.MxObject[]) => this.setLocationsFromMxObjects(mxObjects),
                error: error => this.setState({
                    alertMessage: `An error occurred while retrieving locations: ${error.message} in ` + microflow,
                    locations: []
                }),
                params: {
                    guids: contextObject ? [ contextObject.getGuid() ] : []
                }
            });
        }
    }

    private setLocationsFromMxObjects(mxObjects: mendix.lib.MxObject[]) {
        const locations = mxObjects.map(mxObject => {
            const lat = mxObject.get(this.props.latitudeAttribute);
            const lon = mxObject.get(this.props.longitudeAttribute);
            return {
                address: mxObject.get(this.props.addressAttribute) as string,
                latitude: lat ? Number(lat) : undefined,
                longitude: lon ? Number(lon) : undefined
            };
        });

        this.setState({ locations });
    }

    private static parseStyle = (style = ""): {[key: string]: string} => { // Doesn't support a few stuff.
        try {
            return style.split(";").reduce<{[key: string]: string}>((styleObject, line) => {
                const pair = line.split(":");
                if (pair.length === 2) {
                    const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                    styleObject[name] = pair[1].trim();
                }
                return styleObject;
            }, {});
        } catch (error) {
            // tslint:disable-next-line no-console
            window.console.log("Failed to parse style", style, error);
        }

        return {};
    }
}

export { GoogleMapContainer as default, GoogleMapContainerProps, GoogleMapContainer, DataSource };
