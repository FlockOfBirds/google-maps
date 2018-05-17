import { Component, createElement } from "react";
import { Map, heightUnitType, widthUnitType } from "./Map";
import { Alert } from "./Alert";
import { ValidateConfigs } from "../utils/ValidateConfigs";
import { Location, StaticLocation, getStaticMarkerUrl, parseStaticLocations, parseStyle } from "../utils/ContainerUtils";
import { LatLng } from "google-map-react";

interface WrapperProps {
    "class"?: string;
    mxform: mxui.lib.form._FormBase;
    friendlyId: string;
    mxObject: mendix.lib.MxObject;
    style: string;
}

interface GoogleMapContainerProps extends WrapperProps {
    apiKey: string;
    autoZoom: boolean;
    dataSource: DataSource;
    dataSourceMicroflow: string;
    defaultCenterAddress: string;
    defaultCenterLatitude: string;
    defaultCenterLongitude: string;
    defaultMakerIcon: string;
    entityConstraint: string;
    height: number;
    heightUnit: heightUnitType;
    mapStyles: string;
    optionDrag: boolean;
    optionMapControl: boolean;
    optionScroll: boolean;
    optionStreetView: boolean;
    optionZoomControl: boolean;
    locationsEntity: string;
    addressAttribute: string;
    latitudeAttribute: string;
    longitudeAttribute: string;
    markerImageAttribute: string;
    addressAttributeContext: string;
    latitudeAttributeContext: string;
    longitudeAttributeContext: string;
    markerImageAttributeContext: string;
    staticLocations: StaticLocation[];
    markerImages: Array<{ enumKey: string, enumImage: string}>;
    onClickMicroflow: string;
    onClickNanoflow: Nanoflow;
    onClickEvent: OnClickOptions;
    openPageAs: PageLocation;
    page: string;
    width: number;
    widthUnit: widthUnitType;
    zoomLevel: number;
}

interface Nanoflow {
    nanoflow: object[];
    paramsSpec: { Progress: string };
}

type DataSource = "static" | "context" | "XPath" | "microflow";
type OnClickOptions = "doNothing" | "showPage" | "callMicroflow" | "callNanoflow";
type PageLocation = "content" | "popup" | "modal";

class GoogleMapContainer extends Component<GoogleMapContainerProps, { alertMessage?: string, locations: Location[] }> {
    private subscriptionHandles: number[];

    constructor(props: GoogleMapContainerProps) {
        super(props);

        this.subscriptionHandles = [];
        this.state = { alertMessage: GoogleMapContainer.validateProps(this.props), locations: [] };
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
                defaultCenterLatitude: this.props.defaultCenterLatitude,
                defaultCenterLongitude: this.props.defaultCenterLongitude,
                height: this.props.height,
                heightUnit: this.props.heightUnit,
                locations: this.state.locations,
                optionDrag: this.props.optionDrag,
                optionMapControl: this.props.optionMapControl,
                optionScroll: this.props.optionScroll,
                optionStreetView: this.props.optionStreetView,
                optionZoomControl: this.props.optionZoomControl,
                onClickAction: this.handleOnClickAction,
                style: parseStyle(this.props.style),
                mapStyles: this.props.mapStyles,
                width: this.props.width,
                widthUnit: this.props.widthUnit,
                zoomLevel: this.props.zoomLevel
            });
        }
    }

    componentWillReceiveProps(nextProps: GoogleMapContainerProps) {
        const alertMessage = ValidateConfigs.validate(nextProps);
        if (alertMessage) {
            this.setState({ alertMessage });
        } else {
            this.subscribe(nextProps.mxObject);
            this.fetchData(nextProps.mxObject);
        }
    }

    componentDidMount() {
        if (!this.state.alertMessage) {
            this.fetchData(this.props.mxObject);
        }
    }

    componentWillUnmount() {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
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
                this.props.longitudeAttribute,
                this.props.markerImageAttribute,
                this.props.addressAttributeContext,
                this.props.latitudeAttributeContext,
                this.props.longitudeAttributeContext,
                this.props.markerImageAttributeContext
            ].forEach(attr => this.subscriptionHandles.push(window.mx.data.subscribe({
                attr,
                callback: () => this.fetchData(contextObject), guid: contextObject.getGuid()
            })));
        }
    }

    private fetchData(contextObject?: mendix.lib.MxObject) {
        if (this.props.dataSource === "static") {
            this.setState({ locations: parseStaticLocations(this.props) });
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
            this.setLocationsFromMxObjects([ contextObject ], true);
        }
    }

    private fetchLocationsByXPath(contextGuid: string) {
        const { entityConstraint } = this.props;
        const requiresContext = entityConstraint && entityConstraint.indexOf("[%CurrentObject%]") > -1;
        if (!contextGuid && requiresContext) {
            this.setState({ locations: [] });
            return;
        }

        const constraint = entityConstraint ? entityConstraint.replace(/\[%CurrentObject%\]/g, contextGuid) : "";
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
                    applyto: "selection",
                    guids: contextObject ? [ contextObject.getGuid() ] : []
                }
            });
        }
    }

    private setLocationsFromMxObjects(mxObjects: mendix.lib.MxObject[], isContext = false) {
        const locations = mxObjects.map(mxObject => {
            const latitudeAttribute = isContext ? this.props.latitudeAttributeContext : this.props.latitudeAttribute;
            const longitudeAttribute = isContext ? this.props.longitudeAttributeContext : this.props.longitudeAttribute;
            const addressAttribute = isContext ? this.props.addressAttributeContext : this.props.addressAttribute;
            const markerImageAttribute = isContext ? this.props.markerImageAttributeContext : this.props.markerImageAttribute;

            const lat = mxObject.get(latitudeAttribute);
            const lon = mxObject.get(longitudeAttribute);
            const address = mxObject.get(addressAttribute) as string;
            const url = this.getMxObjectMarkerUrl(mxObject.get(markerImageAttribute) as string);

            return {
                address,
                latitude: lat ? Number(lat) : undefined,
                longitude: lon ? Number(lon) : undefined,
                url
            };
        });

        this.setState({ locations });
    }

    private getMxObjectMarkerUrl(imageKey: string): string {
        const image = this.props.markerImages.find(value => value.enumKey === imageKey);

        return image
            ? getStaticMarkerUrl(image.enumImage as string, this.props.defaultMakerIcon)
            : "";
    }

    public static validateProps(props: GoogleMapContainerProps): string {
        let errorMessage = "";
        if (props.onClickEvent === "callMicroflow" && !props.onClickMicroflow) {
            errorMessage = "A 'Microflow' is required for on click 'Marker' event 'Call a microflow'";
        } else if (props.onClickEvent === "callNanoflow" && !props.onClickNanoflow.nanoflow) {
            errorMessage = "A 'Nanoflow' is required for on click 'Marker' event 'Call a nanoflow'";
        } else if (props.onClickEvent === "showPage" && !props.page) {
            errorMessage = "A 'Page' is required for on click 'Marker' event 'Show a page'";
        }
        if (errorMessage) {
            errorMessage = `Error in google maps configuration: ${errorMessage}`;
        }

        return errorMessage;
    }

    private handleOnClickAction = (data: LatLng) => {
        const { latitudeAttribute, locationsEntity, longitudeAttribute } = this.props;
        const latitude = data.lat ? Math.round(data.lat * 100000000) / 100000000 : 0 ;
        const longitude = data.lng ? Math.round(data.lng * 100000000) / 100000000 : 0;
        // Note: The precision in the databae is limited to 20 digits before and 8 digits after the decimal point

        mx.data.create({
            entity: locationsEntity,
            callback: object => {
                object.set(latitudeAttribute, latitude);
                object.set(longitudeAttribute, longitude);
                this.executeAction(object);
            },
            error: error => window.mx.ui.error(`Error creating event entity ${locationsEntity} : ${error.message}`)
        });
    }

    private executeAction = (object: mendix.lib.MxObject) => {
        const { mxform, onClickEvent, onClickMicroflow, onClickNanoflow, openPageAs, page } = this.props;
        const context = new mendix.lib.MxContext();
        context.setContext(object.getEntity(), object.getGuid());

        if (onClickEvent === "callMicroflow" && onClickMicroflow) {
            mx.ui.action(onClickMicroflow, {
                origin: mxform,
                params: { applyto: "selection", guids: [ object.getGuid() ] },
                error: error => window.mx.ui.error(`Error executing on click microflow ${onClickMicroflow} : ${error.message}`)
            });
        } else if (onClickEvent === "callNanoflow" && onClickNanoflow.nanoflow) {
            window.mx.data.callNanoflow({
                nanoflow: onClickNanoflow,
                origin: mxform,
                context,
                error: error => window.mx.ui.error(`Error while executing the on change nanoflow: ${error.message}`)
            });
        } else if (onClickEvent === "showPage" && page) {
            window.mx.ui.openForm(page, {
                location: openPageAs,
                context,
                error: error => window.mx.ui.error(`Error while opening page ${page}: ${error.message}`)
            });
        }
    }
}

export { GoogleMapContainer as default, GoogleMapContainerProps, GoogleMapContainer, DataSource };
