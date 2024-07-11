/**
 * @jest-environment jsdom
 */

// jest testing for fetch calls in script.js
const { displayPopularMovies, addCommasToNumber, fetchAPIData, searchAPIData, createCard } = require('../js/script.js');
const { testObject } = require('./object.js');

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(testObject),
  })
);

beforeEach(() => {
  let fs = require("fs");
  let fileContents = fs.readFileSync("./index.html", "utf-8");
  document.open();
  document.write(fileContents);
  document.close();
  // Clear mock calls before each test
  fetch.mockClear();
});

describe('displayPopularMovies Test Collection',() => {
  test('displayPopularMovies fetches data', async () => {
    await displayPopularMovies();
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

describe('API Test Collection',() => {
  describe('fetchAPIData Test Collection',() => {
    test('fetchAPIData fetches an object', async () => {
      const result = await fetchAPIData('movie/popular');
      expect(result).toEqual(testObject);
    });
    
    test('fetchAPIData fetches data with 20 objects', async () => {
      const result = await fetchAPIData('movie/popular');
      expect(result.results.length).toBe(20);
    });
  });

  describe('searchAPIData Test collection',() => {
    describe('searchAPIData Test Collection',() => {
      test('searchAPIData fetches an object', async () => {
        const result = await searchAPIData();
        expect(result).toEqual(testObject);
      });
      
      test('searchAPIData fetches data with 20 objects', async () => {
        const result = await searchAPIData();
        expect(result.results.length).toBe(20);
      });
    });
  });
});

describe('Testing addCommasToNumber function', () => {
  test('addCommasToNumber adds commas to a number', () => {
    const result = addCommasToNumber(1000);
    expect(result).toBe('1,000');
  });

  test('addCommasToNumber returns NaN if not a number', () => {
    const result = addCommasToNumber('string');
    expect(result).toBe('NaN');
  });
});

describe('Testing createCard function', () => {
  test('createCard creates a card element', () => {
    const card = createCard(testObject.results[0]);
    expect(card).toBeTruthy();
  });
});