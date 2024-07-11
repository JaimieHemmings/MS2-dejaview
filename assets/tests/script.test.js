/**
 * @jest-environment jsdom
 */
beforeEach(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("./index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
})

describe("DOM tests", () => {
    test("H1 Should exist", () => {
        expect(document.querySelector("span")).not.toBe(1);
    });
});