import Vue from 'vue';
import Router from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import RequestListPage from '../views/RequestListPage.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/', name: 'RequestList', component: RequestListPage },
  ],
});

export default router;
