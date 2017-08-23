class HomePage {
    public open(): void {
        browser.url("/");
    }
}
const page = new HomePage();
export default page;
