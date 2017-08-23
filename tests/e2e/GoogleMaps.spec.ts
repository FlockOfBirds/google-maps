import HomePage from "./pages/home.page";

describe("Google maps", () => {
    it("should show single location", () => {
        HomePage.open();
    });

    it("should show multiple locations", () => {
        HomePage.open();
    });

    it("when xpath selected should show locations", () => {
        HomePage.open();
    });

    it("when latatitude text input changed, marker should change", () => {
        HomePage.open();
    });

    it("when address text input changed, marker should change", () => {
        HomePage.open();
    });
});
