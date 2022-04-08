import { createStore } from "vuex";

/* eslint-disable no-param-reassign */
export default new createStore({
  state: {
    cookies: [],
  },
  mutations: {
    insertCookie(state, cookie) {
      state.cookies.push({ cookie });
    },
  },
  actions: {
    addCookie(context, payload) {
      let c = { ...payload };
      context.state.cookies.push(c);
      console.log(
        `Now there are ${context.state.cookies.length} cookies in store`
      );

      // DOOOO: add refresh button
    },
  },
});
