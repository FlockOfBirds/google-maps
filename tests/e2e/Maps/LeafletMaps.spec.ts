import singleLocationPage from "./pages/singleLocation.page";
import xpathPage from "./pages/xpath.page";
import oldXpathPage from "../GoogleMap/pages/xpath.page";
import oldSingleLocationPage from "../GoogleMap/pages/singleLocation.page";
import { Element } from "webdriverio";

describe("Maps", () => {
    describe("#Leaflet maps", () => {
        const alertValue = "invalid location";

        it("should show a single location", () => {
            singleLocationPage.open();
            singleLocationPage.markers.waitForVisible();

            const markerList: WebdriverIO.Element[] = singleLocationPage.markers.value;
            expect(markerList.length).toBe(1);
        });

        it("with wrong coodinates should show an alert message", () => {
            singleLocationPage.latitudeInput.waitForExist();
            singleLocationPage.longitudeInput.waitForExist();

            singleLocationPage.latitudeInput.click();
            singleLocationPage.latitudeInput.setValue(190);
            singleLocationPage.longitudeInput.click();
            singleLocationPage.longitudeInput.setValue(200);
            singleLocationPage.longitudeLabel.click();

            singleLocationPage.alert.waitForExist();
            const alert = singleLocationPage.alert.getText();

            expect (alert).toContain(alertValue);
        });

        describe("when xpath data source is selected", () => {
            it("it should show multiple locations", () => {
                xpathPage.open();
                xpathPage.getGrid(1).waitForVisible();
                xpathPage.getGridRow(0).waitForVisible();
                xpathPage.getGridRow(0).click();
                xpathPage.markers.waitForVisible();

                browser.waitUntil(() => {
                    const markerList: WebdriverIO.Element[] = xpathPage.markers.value;

                    return markerList.length > 1;
                }, 5000, "expected more than 1 marker to be populated");
            });
        });
    });

    describe("#Google maps", () => {
        it("should show single location", () => {
            oldSingleLocationPage.open();
            oldSingleLocationPage.markers.waitForVisible();

            const markerList: Element[] = oldSingleLocationPage.markers.value;
            expect(markerList.length).toBe(1);
        });

        it("when xpath selected should show locations", () => {
            oldXpathPage.open();
            oldXpathPage.getGrid(1).waitForVisible();
            oldXpathPage.getGridRow(1, 2).waitForVisible();
            oldXpathPage.getGridRow(1, 2).click();
            oldXpathPage.getGridRow(2, 0).waitForVisible();
            oldXpathPage.markers.waitForVisible();

            browser.waitUntil(() => {
                const markerList: Element[] = oldXpathPage.markers.value;

                return markerList.length > 1;
            }, 5000, "expected more markers to be populated");
        });
    });
});
