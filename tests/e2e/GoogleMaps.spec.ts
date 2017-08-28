import page from "./pages/home.page";
import { Element } from "webdriverio";

describe("Google maps", () => {
    it("should show single location", () => {
        page.open();
        page.googleMapNavBarItem.waitForVisible();
        page.googleMapNavBarItem.click();
        page.navBarItems.waitForVisible();
        page.correctAddressBarItem.waitForVisible();
        page.correctAddressBarItem.click();
        page.markers.waitForVisible();

        const markerList: Element[] = page.markers.value;
        expect(markerList.length).toBe(1);

    });

    it("when xpath selected should show locations", () => {
        page.open();
        page.gridRow1.waitForVisible();
        page.gridRow1.click();
        page.markers.waitForVisible();

        const markerList: Element[] = page.markers.value;
        expect(markerList.length).toBeGreaterThan(1);
    });
});
