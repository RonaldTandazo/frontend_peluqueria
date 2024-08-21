import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginForm from '../components/LoginForm.vue';
import SignUpForm from '../components/SignUpForm.vue';

const routes = [
  {
    path: '/',
    component: HomePage,
    children: [
      {
        path: '',
        redirect: 'login', // Redirige a /login cuando la ruta es /
      },
      {
        path: 'login',
        name: 'LoginForm',
        component: LoginForm,
      },
      {
        path: 'signup',
        name: 'SignUp',
        component: SignUpForm,
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',  // Ruta de captura para rutas inexistentes
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
