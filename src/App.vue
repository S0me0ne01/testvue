<template>
  <v-app>
    <v-app-bar
      app
      color="green"
      dark
    >

      <div align="center" class="d-flex align-center">
        <span class="mr-2">Vue Test App</span>
      </div>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
