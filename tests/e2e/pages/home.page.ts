import { Client, Element, RawResult } from "webdriverio";

class HomePage {

    public get navBarItems(): Client<RawResult<Element[]>> & RawResult<Element[]> {
        return browser.elements(".mx-navbar-item");
    }

    public get googleMapNavBarItem(): Client<RawResult<Element>> & RawResult<Element> {
        return browser.element("#mxui_widget_Navbar_0 > ul > li:nth-child(2)");
    }

    public get correctAddressBarItem(): Client<RawResult<Element>> & RawResult<Element> {
        return browser.element("#mxui_widget_Navbar_0 > ul > li.mx-navbar-item.dropdown.open > ul > li:nth-child(1)");
    }

    public get markers(): Client<RawResult<Element[]>> & RawResult<Element[]> {
        return browser.elements(".widget-google-maps-marker");
    }

    public get gridRow1(): Client<RawResult<Element>> & RawResult<Element> {
        return browser.element(".mx-name-index-0");
    }

    public open(): void {
        browser.url("/");
    }
}
const page = new HomePage();
export default page;
