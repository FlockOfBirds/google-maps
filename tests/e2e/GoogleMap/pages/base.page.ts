import { Client, Element, RawResult } from "webdriverio";

export class BasePage {
    public get markers(): Client<RawResult<Element[]>> & RawResult<Element[]> {
        return browser.elements(".widget-google-maps-marker");
    }
}
