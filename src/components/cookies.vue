<template>
  <div class="cookies">
    <h1>Hello {{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: "cookieTable",
  data() {
    return {
      cookies: [],
    };
  },
};
</script>
