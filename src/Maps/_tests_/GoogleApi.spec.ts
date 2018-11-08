import { shallow } from "enzyme";
import { createElement } from "react";

import googleApiWrapper from "../components/GoogleApi";

describe("Google maps wrapper", () => {

    const myComponent = () => createElement("div", {});
    const wrapperComponent = googleApiWrapper("https://dummy.url")(myComponent);

    it("should render a component when a script exists", () => {
        const wrapperElement = createElement(wrapperComponent);
        const wrapper = shallow(wrapperElement);

        expect(wrapper.html()).not.toBe("");
    });

});
