const DB_NAME = "cookiedb";
const DB_VERSION = 1;
let DB;

export default {
  async getDb() {
    return new Promise((resolve, reject) => {
      if (DB) {
        return resolve(DB);
      }
      console.log("OPENING DB", DB);
      let request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (e) => {
        console.log("Error opening db", e);
        reject("Error");
      };

      request.onsuccess = (e) => {
        console.log("Successfully opened DB");
        DB = e.target.result;
        resolve(DB);
      };

      request.onupgradeneeded = (e) => {
        console.log("onupgradeneeded");
        let db = e.target.result;
        let objectStore = db.createObjectStore("cookies");
        objectStore.createIndex("name", "name", { unique: false });
        // objectStore.createIndex("domain", "domain", { unique: false });
        // objectStore.createIndex("path", "path", { unique: false });
        // objectStore.createIndex("label", "current_label", { unique: false });
      };
    });
  },

  async deleteCookie(cookie) {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["cookies"], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };

      let store = trans.objectStore("cookies");
      store.delete(cookie.name);
    });
  },

  async getCookies() {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["cookies"], "readonly");
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
  },

  async saveCookie(cookie) {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["cookies"], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };

      let store = trans.objectStore("cookies");
      store.put(cookie);
    });
  },
};
