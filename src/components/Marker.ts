import { StatelessComponent, createElement } from "react";
import { LatLng } from "google-map-react";

export interface MarkerProps {
    lat: number;
    lng: number;
    url?: string;
    onClickAction?: (data: LatLng) => void;
}

export const Marker: StatelessComponent<MarkerProps> = (props) => {
    if (props.url) {
        const style = { backgroundImage: `url(${props.url})` };

        return createElement("div", {
            className: "widget-google-maps-marker-url",
            style,
            onClick: props.onClickAction
        });
    }

    return createElement("div", { className: "widget-google-maps-marker" });
};

Marker.displayName = "Marker";
