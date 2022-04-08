<template>
  <div class="main_app">
    <h1>Sup</h1>
    <code>{{ cookies.length }} Cookies</code>
    <div v-if="cookies.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Domain</th>
            <th scope="col">Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cookie, idx) in cookies" :key="idx">
            <th scope="row">{{ cookie.domain }}</th>
            <td>{{ cookie.name }}</td>
          </tr>
        </tbody>
      </table>
      <ul></ul>
    </div>
    <button @click="refreshCookies">Refresh</button>
  </div>
</template>

<script>
export default {
  name: "popupView",
  data() {
    return {
      cookies: [],
    };
  },
  methods: {
    refreshCookies() {
      const self = this; // We don't have access to 'this' in sendMessage()
      console.log("refreshing cookies...");
      chrome.runtime.sendMessage("get_cookies", function (response) {
        console.log(`received ${response.length} cookies`);
        self.cookies = response;
        console.log(self.cookies[0]);
      });
    },
  },
};
</script>

<style>
.main_app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
