import xpathPage from "./pages/xpath.page";
import singleLocationPage from "./pages/singleLocation.page";
import { Element } from "webdriverio";
import indexPage from "./pages/index.page";

describe("Google maps", () => {
    beforeAll(() => {
        indexPage.tearDownSetUp();
    });

    beforeEach(() => {
        // wait for the records to be populated
        browser.timeouts("implicit", 20 * 1000);
    });

    it("should show single location", () => {
        singleLocationPage.open();
        singleLocationPage.markers.waitForVisible();

        const markerList: Element[] = singleLocationPage.markers.value;
        expect(markerList.length).toBe(1);
    });

    it("when xpath selected should show locations", () => {
        xpathPage.open();
        xpathPage.getGrid(1).waitForVisible();
        xpathPage.getGridRow(1, 2).waitForVisible();
        xpathPage.getGridRow(1, 2).click();
        xpathPage.getGridRow(2, 0).waitForVisible();
        xpathPage.markers.waitForVisible();

        browser.waitUntil(() => {
            const markerList: Element[] = xpathPage.markers.value;

            return markerList.length > 1;
        }, 5000, "expected more markers to be populated");
    });
});
