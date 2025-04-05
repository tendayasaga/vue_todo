import LoginPage from '@/components/LoginPage.vue';
import ToDolist from '@/components/ToDolist.vue';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/todo',
      name: 'todo',
      component: ToDolist
    }
  ]
});
