import { StatelessComponent, createElement } from "react";

export interface MarkerProps {
    lat: number;
    lng: number;
}

export const Marker: StatelessComponent<MarkerProps> = (props) =>
    createElement("div", { className: "widget-google-maps-marker" });

Marker.displayName = "Marker";
