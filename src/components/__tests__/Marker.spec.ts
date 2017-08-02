import { createElement } from "react";
import { shallow } from "enzyme";

import { Marker } from "../Marker";

describe("Marker", () => {

    it("should render with the marker structure", () => {
        const marker = shallow(createElement(Marker, { lat: 30, lng: 118 }));

        expect(marker).toBeElement(
            createElement("div", { className: "widget-google-maps-marker" })
        );
    });
});
