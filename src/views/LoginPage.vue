<template>
  <div style="background-image: url('/bg.jpg'); background-size: cover; height: 100vh">
    <v-container fluid fill-height class="d-flex justify-center align-center">
      <v-card class="login-card">
        <v-card-title class="green lighten-1 white--text">
          Вход
        </v-card-title>
        <v-card-text>
          <v-form style="margin-top: 10px" @submit.prevent="handleLogin">
            <v-text-field
              v-model="username"
              placeholder="+7"
              prepend-inner-icon="mdi-phone"
              required
              outlined
            ></v-text-field>
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Пароль"
              prepend-inner-icon="mdi-eye"
              @click:prepend-inner="togglePasswordVisibility"
              outlined
              required
            ></v-text-field>
            <v-btn color="green" class="white--text" type="submit">
              Войти
            </v-btn>
            <v-alert v-if="errorMessage" type="error" class="mt-2">
              {{ errorMessage }}
            </v-alert>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      username: '+7',
      password: '',
      errorMessage: '',
      showPassword: false,
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        await this.login({ username: this.username, password: this.password });
        this.$router.push('/');
      } catch (error) {
        this.errorMessage = 'Неверные данные для входа';
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped lang="scss">
.login-card {
  width: 400px;
  max-width: 90vw;
  border-radius: 8px;
}

.v-card-title {
  font-size: 24px;
  justify-content: center;
}

.v-btn {
  width: 100%;
  margin-top: 15px;
}

.v-alert {
  padding: 10px;
  text-align: center;
}
</style>
