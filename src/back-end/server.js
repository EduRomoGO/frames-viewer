import serverStatus from "./serverStatus";
import { variant, columns } from "./db";

const MAX_DELAY = 3000;

const isInRange = (range, value) => {
  return value >= range.min && value < range.max;
};

const getResponse = responseBody => {
  const failFactorRange = { min: 0.85, max: 1 };
  const notAuthorisedRange = { min: 0.75, max: 0.85 };
  const status = Math.random();

  if (true) {
    throw new Error(serverStatus.INTERNAL_SERVER_ERROR);
  } else if (isInRange(notAuthorisedRange, status)) {
    throw new Error(serverStatus.UNAUTHORIZED);
  }
  return { body: responseBody };
};


/**
 * @typedef {Object} ServerResponse
 * @property {any} body
 * @property {number} error
 */


/**
 * @function mockFetch
 * @params {string} endpoint
 * @returns {Promise<ServerResponse>}
*/
export const mockFetch = endpoint => {
  const serverDelay = MAX_DELAY * Math.random();


  return new Promise((resolve, reject) => {
    let response = null;

    // I have modified this method so the fake server actually returns something to the front, even if it is a 500/401 error, otherwise it just throws an error that I am not able to catch in my code
    const returnResponse = (item) => {
      try {
        resolve(getResponse(item));
      } catch (err) {
        reject({ status: err.message });
      }
    };

    setTimeout(() => {
      switch (endpoint) {
        case "/variant":
          returnResponse(variant);
          break;
        case "/columns":
          returnResponse(columns);
          break;
        default:
          resolve(response);
      }
    }, 600);
  });
};
