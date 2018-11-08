import { BasePage } from "./base.page";

class SingleLocationPage extends BasePage {
    public open(): void {
        browser.url("/p/CorrectAddress");
    }
}

const singleLocationPage = new SingleLocationPage();
export default singleLocationPage;
