/**
 * @jest-environment jsdom
 */

// jest testing for fetch calls in script.js
const { displayPopularMovies, addCommasToNumber, fetchAPIData, searchAPIData, createCard, showSpinner, hideSpinner } = require('../js/script.js');
const { testObject } = require('./object.js');

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(testObject),
  })
);

// Clean test environment between tests
beforeEach(() => {
  // Clear mock calls before each test
  fetch.mockClear();
  let fs = require("fs");
  let fileContents = fs.readFileSync("./index.html", "utf-8");
  document.open();
  document.write(fileContents);
  document.close();
});

// Test fetch calls
describe('displayPopularMovies Test Collection',() => {
  test('displayPopularMovies fetches data', async () => {
    await displayPopularMovies();
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

// Test API calls
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

  // Test searchAPIData
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

// Test helper functions
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

// Test DOM manipulation functions
describe('Testing createCard function', () => {
  test('createCard creates a card element', () => {
    const card = createCard(testObject.results[0]);
    expect(card).toBeTruthy();
  });
});

// Test spinner functions
describe('Testing showSpinner function', () => {
  test('showSpinner adds show class to spinner', () => {
    showSpinner();
    const spinner = document.querySelector('.spinner');
    expect(spinner.classList.contains('show')).toBeTruthy();
  });
});

describe('Testing hideSpinner function', () => {
  test('hideSpinner removes show class from spinner', () => {
    hideSpinner();
    const spinner = document.querySelector('.spinner');
    expect(spinner.classList.contains('show')).not.toBeTruthy();
  });
});