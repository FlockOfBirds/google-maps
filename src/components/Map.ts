import { Component, Props, ReactElement, createElement } from "react";
import GoogleMap, { GoogleMapLoader, LatLng } from "google-map-react";

import { Alert } from "./Alert";
import { Marker, MarkerProps } from "./Marker";

import "../ui/GoogleMaps.css";

export type widthUnitType = "percentage" | "pixels";
export type heightUnitType = "percentageOfWidth" | "percentageOfParent" | "pixels";

export interface Location {
    address?: string;
    latitude?: number;
    longitude?: number;
}
export interface MapProps extends Props<Map> {
    apiKey?: string;
    defaultCenterAddress: string;
    height: number;
    heightUnit: heightUnitType;
    locations: Location[];
    optionDrag: boolean;
    optionMapControl: boolean;
    optionScroll: boolean;
    optionStreetView: boolean;
    optionZoomControl: boolean;
    width: number;
    widthUnit: widthUnitType;
    zoomLevel: number;
}

export interface MapState {
    alertMessage?: string;
    center?: LatLng;
    isLoaded?: boolean;
    locations?: Location[];
}

export class Map extends Component<MapProps, MapState> {
    // Location of Mendix Netherlands office
    private defaultCenterLocation: LatLng = { lat: 51.9107963, lng: 4.4789878 };
    private mapWrapper: HTMLElement | null;
    private mapLoader?: GoogleMapLoader;
    private bounds: google.maps.LatLngBounds;

    constructor(props: MapProps) {
        super(props);

        this.state = {
            center: this.defaultCenterLocation,
            isLoaded: false,
            locations: props.locations
        };
        this.handleOnGoogleApiLoaded = this.handleOnGoogleApiLoaded.bind(this);
        this.onResizeIframe = this.onResizeIframe.bind(this);
    }

    render() {
        return createElement("div",
            {
                className: "widget-google-maps-wrapper",
                ref: (node: HTMLElement | null) => this.mapWrapper = node,
                style: this.getStyle()
            },
            createElement("div", { className: "widget-google-maps" },
                createElement(Alert, {
                    bootstrapStyle: "danger",
                    className: "widget-google-maps-alert",
                    message: this.state.alertMessage
                }),
                createElement(GoogleMap,
                    {
                        bootstrapURLKeys: { key: this.props.apiKey },
                        center: this.state.center,
                        defaultZoom: this.props.zoomLevel,
                        onGoogleApiLoaded: this.handleOnGoogleApiLoaded,
                        options: {
                            draggable: this.props.optionDrag,
                            mapTypeControl: this.props.optionMapControl,
                            maxZoom: 20,
                            minZoom: 1,
                            minZoomOverride: true,
                            resetBoundsOnResize: true,
                            scrollwheel: this.props.optionScroll,
                            streetViewControl: this.props.optionStreetView,
                            zoomControl: this.props.optionZoomControl
                        },
                        resetBoundsOnResize: true,
                        yesIWantToUseGoogleMapApiInternals: true
                    },
                    this.createMakers()
                )
            )
        );
    }

    componentDidMount() {
        this.adjustStyle();
        this.setUpEvents();
    }

    componentWillReceiveProps(nextProps: MapProps) {
        this.setState({ locations: nextProps.locations });
        this.resolveAddresses(nextProps);
    }

    componentWillUnmount() {
        if (this.getIframe()) {
            window.removeEventListener("resize", this.onResizeIframe);
        }
    }

    private adjustStyle() {
        if (this.mapWrapper) {
            const wrapperElement = this.mapWrapper.parentElement;
            if (this.props.heightUnit === "percentageOfParent" && wrapperElement) {
                wrapperElement.style.height = "100%";
                wrapperElement.style.width = "100%";
            }
        }
    }

    private setUpEvents() {
        // A workaround for attaching the resize event to the Iframe window because the google-map-react
        // library does not support it. This fix will be done in the web modeler preview class when the
        // google-map-react library starts supporting listening to Iframe events.
        const iFrame = this.getIframe();
        if (iFrame) {
            iFrame.contentWindow.addEventListener("resize", this.onResizeIframe);
        }
    }

    private getIframe(): HTMLIFrameElement {
        return document.getElementsByClassName("t-page-editor-iframe")[0] as HTMLIFrameElement;
    }

    private onResizeIframe(event: CustomEvent) {
        if (this.mapLoader) {
            const originalCenter = this.mapLoader.map.getCenter();
            this.mapLoader.maps.event.trigger(this.mapLoader.map, "resize");
            this.mapLoader.map.setCenter(originalCenter);
            window.dispatchEvent(new Event("resize"));
        }
    }

    private getStyle(): object {
        const style: { paddingBottom?: string; width: string, height?: string } = {
            width: this.props.widthUnit === "percentage" ? `${this.props.width}%` : `${this.props.width}`
        };
        if (this.props.heightUnit === "percentageOfWidth") {
            style.paddingBottom = `${this.props.height}%`;
        } else if (this.props.heightUnit === "pixels") {
            style.paddingBottom = `${this.props.height}`;
        } else if (this.props.heightUnit === "percentageOfParent") {
            style.height = `${this.props.height}%`;
        }
        return style;
    }

    private handleOnGoogleApiLoaded(mapLoader: GoogleMapLoader) {
        this.mapLoader = mapLoader;
        this.setState({ isLoaded: true });
        this.resolveAddresses(this.props);
    }

    private updateBounds(props: MapProps, location: Location) {
        if (this.mapLoader) {
            this.bounds.extend(new google.maps.LatLng(location.latitude as number, location.longitude as number));
            this.mapLoader.map.fitBounds(this.bounds);
            this.setZoom(props);
            if (!props.defaultCenterAddress) {
                this.setState({ center: { lat: this.bounds.getCenter().lat(), lng: this.bounds.getCenter().lng() } });
            }
        }
    }

    private setZoom(props: MapProps): void {
        if (this.mapLoader) {
            let zoom = this.mapLoader.map.getZoom();
            if (props.zoomLevel > 0) {
                zoom = props.zoomLevel;
            } else {
                const defaultBoundZoom = 6;
                if (zoom && (zoom > defaultBoundZoom) || !zoom) {
                    zoom = defaultBoundZoom;
                }
            }
            this.mapLoader.map.setZoom(zoom);
        }
    }

    private resolveAddresses(props: MapProps) {
        if (this.mapLoader) {
            this.bounds = new google.maps.LatLngBounds();
        }
        this.setZoom(props);
        if (props.locations && props.locations.length) {
            props.locations.forEach(location => {
                if (!this.validLocation(location) && location.address) {
                    this.getLocation(location.address, locationLookup => {
                        if (locationLookup) {
                            location.latitude = Number(locationLookup.lat);
                            location.longitude = Number(locationLookup.lng);
                            this.setState({ locations: props.locations });
                            this.updateBounds(props, location);
                        }
                    });
                } else if (this.validLocation(location)) {
                    this.updateBounds(props, location);
                }
            });
        }
        if (props.defaultCenterAddress) {
            this.getLocation(props.defaultCenterAddress, location =>
                location ? this.setState({ center: location }) : this.setState({ center: this.defaultCenterLocation }));
        }
    }

    private validLocation(location: Location): boolean {
        const { latitude: lat, longitude: lng } = location;
        return typeof lat === "number" && typeof lng === "number"
            && lat <= 90 && lat >= -90
            && lng <= 180 && lng >= -180
            && !(lat === 0 && lng === 0);
    }

    private getLocation(address: string, callback: (result?: LatLng) => void) {
        if (this.state.isLoaded) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    this.setState({ alertMessage: "" });
                    callback({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    });
                } else {
                    this.setState({ alertMessage: `Can not find address ${address}` });
                    callback();
                }
            });
        } else {
            callback();
        }
    }

    private createMakers(): Array<ReactElement<MarkerProps>> {
        const markerElements: Array<ReactElement<MarkerProps>> = [];
        if (this.state.locations && this.state.locations.length) {
            this.state.locations.map((locationObject, index) => {
                const { latitude, longitude } = locationObject;
                if (this.validLocation(locationObject)) {
                    markerElements.push(createElement(Marker, {
                        key: index,
                        lat: latitude as number,
                        lng: longitude as number
                    }));
                }
            });
        }
        return markerElements;
    }
}
