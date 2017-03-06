import { Component, createElement } from "react";
import { Location, Map } from "./Map";
import { Alert } from "./Alert";

interface GoogleMapContainerProps {
    apiKey: string;
    contextObject: mendix.lib.MxObject;
    dataSource: DataSource;
    dataSourceMicroflow: string;
    defaultCenterAddress: string;
    entityConstraint: string;
    locationsEntity: string;
    addressAttribute: string;
    latitudeAttribute: string;
    longitudeAttribute: string;
    staticLocations: Location[];
}

type DataSource = "static" | "context" | "XPath" | "microflow";

class GoogleMapContainer extends Component<GoogleMapContainerProps, { alertMessage?: string, locations: Location[] }> {
    private subscriptionHandles: number[];

    constructor(props: GoogleMapContainerProps) {
        super(props);

        const alertMessage = this.validateProps();
        this.subscriptionHandles = [];
        this.state = { alertMessage, locations: [] };
        this.unSubscribeSubscriptions();
    }

    render() {
        if (this.state.alertMessage) {
            return createElement(Alert as any, { message: this.state.alertMessage });
        } else {
            return createElement(Map, {
                apiKey: this.props.apiKey,
                defaultCenterAddress: this.props.defaultCenterAddress,
                locations: this.state.locations
            });
        }
    }

    componentWillReceiveProps(nextProps: GoogleMapContainerProps) {
        this.unSubscribeSubscriptions();
        this.fetchData(nextProps.contextObject);
    }

    componentDidMount() {
        if (!this.state.alertMessage) this.fetchData(this.props.contextObject);
    }

    componentWillUnmount() {
        this.unSubscribeSubscriptions();
    }

    private validateProps() {
        let message = "";
        if (this.props.dataSource === "static" && !this.props.staticLocations.length) {
            message = "At least one static location is required";
        }
        if (this.props.dataSource === "XPath" && !this.props.locationsEntity) {
            message = "The locations entity is required";
        }
        if (this.props.dataSource === "context" && !this.props.locationsEntity) {
            message = "The locations entity is required";
        }
        if (this.props.dataSource === "microflow" && !this.props.dataSourceMicroflow) {
            message = "A data source microflow is required";
        }

        return message;
    }

    private unSubscribeSubscriptions() {
        this.subscriptionHandles.forEach(handle => window.mx.data.unsubscribe(handle));

        if (this.props.contextObject) {
            const contextObject = this.props.contextObject;
            this.subscriptionHandles.push(window.mx.data.subscribe({
                callback: () => this.fetchData(contextObject),
                guid: this.props.contextObject.getGuid()
            }));
            [
                this.props.addressAttribute,
                this.props.latitudeAttribute,
                this.props.longitudeAttribute
            ].forEach((attr) => this.subscriptionHandles.push(window.mx.data.subscribe({
                attr,
                callback: () => this.fetchData(contextObject), guid: contextObject.getGuid()
            })));
        }
    }

    private fetchData(contextObject: mendix.lib.MxObject) {
        if (this.props.dataSource === "static") {
            this.setState({ locations: this.props.staticLocations });
        } else if (this.props.dataSource === "context" && this.props.locationsEntity) {
            this.fetchLocationsByContext(contextObject);
        } else if (this.props.dataSource === "XPath" && this.props.locationsEntity) {
            this.fetchLocationsByXPath(contextObject ? contextObject.getGuid() : "");
        } else if (this.props.dataSource === "microflow" && this.props.dataSourceMicroflow) {
            this.fetchLocationsByMicroflow(this.props.dataSourceMicroflow);
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
                    alertMessage: `An error occurred while retrieving items: ${error} constraint ` + xpath,
                    locations: []
                }),
            xpath
        });
    }

    private fetchLocationsByMicroflow(microflow: string) {
        if (microflow) {
            window.mx.ui.action(microflow, {
                callback: (mxObjects: mendix.lib.MxObject[]) => this.setLocationsFromMxObjects(mxObjects),
                error: error =>
                    this.setState({
                        alertMessage: `An error occurred while retrieving locations: ${error.message} in ` + microflow,
                        locations: []
                    }),
                params: {
                    guids: this.props.contextObject ? [ this.props.contextObject.getGuid() ] : []
                }
            });
        }
    }

    private setLocationsFromMxObjects(mxObjects: mendix.lib.MxObject[]): void {
        const locations = mxObjects.map((mxObject) => ({
            address: mxObject.get(this.props.addressAttribute) as string,
            latitude: Number(mxObject.get(this.props.latitudeAttribute)),
            longitude: Number(mxObject.get(this.props.longitudeAttribute))
        }));

        this.setState({ locations });
    }
}

export { GoogleMapContainer as default, GoogleMapContainerProps, DataSource };
