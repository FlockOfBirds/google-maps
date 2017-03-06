import { DOM, StatelessComponent } from "react";

export interface MarkerProps {
    lat: number;
    lng: number;
}

export const Marker: StatelessComponent<MarkerProps> = (props) =>
    DOM.div({ className: "widget-google-maps-marker" });
