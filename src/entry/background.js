var historyDB = undefined;
const openDBRequest = indexedDB.open("CookieDB", 1);

// executed if the database is new or needs to be updated
openDBRequest.onupgradeneeded = function (event) {
  let objectStore = event.target.result.createObjectStore("cookies");
  objectStore.createIndex("name", "name", { unique: false });
  // objectStore.createIndex("domain", "domain", { unique: false });
  // objectStore.createIndex("path", "path", { unique: false });
  // objectStore.createIndex("label", "current_label", { unique: false });
  console.info("Upgraded the CookieDB.");
};

// success will be called after upgradeneeded
openDBRequest.onsuccess = function (ev1) {
  console.info("Successfully connected to CookieDB.");
  historyDB = ev1.target.result;
  historyDB.onerror = function (ev2) {
    console.error("Database error: " + ev2.target.errorCode);
  };
};

// if the connection failed
openDBRequest.onerror = function (event) {
  console.error(
    `Failed to open CookieDB with error code: ${event.target.errorCode}`
  );
};

// const constructKeyFromCookie = function (cookieDat) {
//   return `${cookieDat.name};${urlToUniformDomain(cookieDat.domain)};${
//     cookieDat.path
//   }`;
// };

/**
 * Insert serialized cookie into IndexedDB storage via a transaction.
 * @param {Object} serializedCookie Cookie to insert into storage.
 */
const insertCookieIntoStorage = function (cookie) {
  if (historyDB !== undefined) {
    let putRequest = historyDB
      .transaction("cookies", "readwrite")
      .objectStore("cookies")
      .put(cookie, cookie.name);
    putRequest.onerror = function (event) {
      console.error(
        `Failed to insert cookie (${cookie.name}) into IndexedDB storage: ${event.target.errorCode}`
      );
    };
  } else {
    console.error(
      "Could not insert cookie because database connection is closed!"
    );
  }
};

const getCookiesFromStorage = async function () {
  if (historyDB !== undefined) {
    return new Promise((resolve) => {
      let trans = historyDB.transaction(["cookies"], "readonly");
      trans.oncomplete = () => {
        resolve(cookies);
      };

      let store = trans.objectStore("cookies");
      let cookies = [];

      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
          cookies.push(cursor.value);
          cursor.continue();
        }
      };
    });
  } else {
    console.error(
      "Could not insert cookie because database connection is closed!"
    );
  }
};

chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request === "get_cookies") {
    console.log("getting cookies...");
    getCookiesFromStorage().then((cookies) => {
      console.log(`sending cookies to frontend: ${cookies}`);
      sendResponse(cookies);
    });
  }
  return true; // Need this to avoid 'message port closed' error
});

chrome.cookies.onChanged.addListener((changeInfo) => {
  if (!changeInfo.removed) {
    insertCookieIntoStorage(changeInfo.cookie);
  }
  getCookiesFromStorage().then((cookies) => {
    console.log(cookies);
  });
});
