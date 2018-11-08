import { SFC, SyntheticEvent, createElement } from "react";

// tslint:disable-next-line:variable-name
export const Overlay: SFC<{}> = ({ children }) =>
    createElement("div", { style: { position: "relative" } },
        children,
        createElement("div", {
            onClick: preventEvent,
            onTouchStart: preventEvent,
            style: {
                height: "100%",
                left: 0,
                position: "absolute",
                top: 0,
                width: "100%",
                zIndex: 10
            }
        })
    );

const preventEvent = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    e.stopPropagation();
};

Overlay.displayName = "Overlay";
