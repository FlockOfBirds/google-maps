import { createElement } from "react";
import { configure, shallow } from "enzyme";
import Adapter = require("enzyme-adapter-react-16");

import { Marker } from "../Marker";

configure({ adapter: new Adapter() });

describe("Marker", () => {

    it("should render with the marker structure", () => {
        const marker = shallow(createElement(Marker, { lat: 30, lng: 118 }));

        expect(marker).toBeElement(
            createElement("div", { className: "widget-google-maps-marker" })
        );
    });
});
