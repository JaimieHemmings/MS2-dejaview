/**
 * @jest-environment jsdom
 */

const { searchAPIData, fetchAPIData, addCommasToNumber } = require("../js/script");

beforeEach(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("./index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
    fetchMock.mockIf(/^https?:\/\/themoviedb.*$/, req => {
        if (req.url.endsWith("/path1")) {
          return "some response body"
        } else if (req.url.endsWith("/path2")) {
          return {
            body: "Example body data",
            headers: {
              "X-Test-Header": "Example Test Header Value"
            } 
          }
        } else {
          return {
            status: 404,
            body: "Not Found"
          }
        }
    });
});

describe("DOM tests", () => {
    test("H1 Should exist", () => {
        expect(document.querySelector("span")).not.toBe(1);
    });
});

describe("Test API functions", () => {
    test("searchAPIData should return data", async () => {
        const data = await searchAPIData();
        expect(data).toBeDefined();
    });
    test("fetchAPIData should return data", async () => {
        const data = await fetchAPIData();
        expect(data).toBeDefined();
    });
});

describe("Test addCommasToNumber", () => {
    test("addCommasToNumber should return a string with commas", () => {
        expect(addCommasToNumber(1000)).toBe("1,000");
    });
    test("addCommasToNumber should return a string with commas", () => {
        expect(addCommasToNumber(1000000000)).toBe("1,000,000,000");
    });
    test("addCommasToNumber should appropriately fail", () => {
        expect(addCommasToNumber("seventeen")).toBe("NaN");
    });
});