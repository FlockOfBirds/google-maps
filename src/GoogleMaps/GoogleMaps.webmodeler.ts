import { Component, createElement } from "react";
import { Map, MapProps } from "./components/Map";
import { Alert } from "../components/Alert";
import { GoogleMapContainerProps } from "./components/GoogleMapContainer";
import { parseStaticLocations, parseStyle } from "./utils/ContainerUtils";
import { ValidateConfigs } from "./utils/ValidateConfigs";

declare function require(name: string): string;
type VisibilityMap = {
    [P in keyof GoogleMapContainerProps]: boolean;
};

// tslint:disable-next-line class-name
export class preview extends Component<GoogleMapContainerProps, {}> {
    render() {
        const warnings = ValidateConfigs.validate(this.props);
        if (!warnings) {
            return createElement(Map, preview.transformProps(this.props));
        } else {
            return createElement("div", {},
                createElement(Alert, { bootstrapStyle: "danger", className: "widget-google-maps-alert" }, warnings),
                createElement(Map, preview.transformProps(this.props)));
        }
    }

    private static transformProps(props: GoogleMapContainerProps): MapProps {
        const locations = props.dataSource === "static" ? parseStaticLocations(props) : [];

        return {
            apiKey: props.apiKey,
            autoZoom: props.autoZoom,
            className: props.class,
            defaultCenterAddress: props.defaultCenterAddress,
            defaultCenterLatitude: props.defaultCenterLatitude,
            defaultCenterLongitude: props.defaultCenterLongitude,
            height: props.height,
            heightUnit: props.heightUnit,
            locations,
            optionDrag: props.optionDrag,
            optionMapControl: props.optionMapControl,
            optionScroll: props.optionScroll,
            optionStreetView: props.optionStreetView,
            optionZoomControl: props.optionZoomControl,
            style: parseStyle(props.style),
            mapStyles: props.mapStyles,
            width: props.width,
            widthUnit: props.widthUnit,
            zoomLevel: props.zoomLevel
        };
    }
}

export function getVisibleProperties(valueMap: GoogleMapContainerProps, visibilityMap: VisibilityMap) {
    if (valueMap.dataSource !== "static") {
        visibilityMap.staticLocations = false;
    }
    if (valueMap.dataSource !== "context") {
        visibilityMap.latitudeAttributeContext = false;
        visibilityMap.longitudeAttributeContext = false;
        visibilityMap.addressAttributeContext = false;
        visibilityMap.markerImageAttributeContext = false;
    }
    if (valueMap.dataSource !== "microflow") {
        visibilityMap.dataSourceMicroflow = false;
    }
    if (valueMap.dataSource !== "XPath") {
        visibilityMap.entityConstraint = false;
    }
    if (valueMap.dataSource !== "microflow" && valueMap.dataSource !== "XPath") {
        visibilityMap.locationsEntity = false;
        visibilityMap.latitudeAttribute = false;
        visibilityMap.longitudeAttribute = false;
        visibilityMap.addressAttribute = false;
        visibilityMap.markerImageAttribute = false;
    }

    return visibilityMap;
}

export function getPreviewCss() {
    return require("../ui/GoogleMaps.css");
}
