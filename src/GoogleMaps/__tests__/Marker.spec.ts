import { createElement } from "react";
import { configure, shallow } from "enzyme";
import Adapter = require("enzyme-adapter-react-16");

import { Marker } from "../components/Marker";

configure({ adapter: new Adapter() });

describe("Marker", () => {

    it("should render the marker structure", () => {
        const marker = shallow(createElement(Marker, { lat: 30, lng: 118 }));

        expect(marker).toBeElement(
            createElement("div", { className: "widget-google-maps-marker" })
        );
    });

    it("with custom URL should render the marker structure", () => {
        const url = "http://dummy.url";
        const style = { backgroundImage: `url(${url})` };
        const marker = shallow(createElement(Marker, { lat: 30, lng: 118, url }));

        expect(marker).toBeElement(
            createElement("div", {
                className: "widget-google-maps-marker-url",
                style
            })
        );
    });
});
