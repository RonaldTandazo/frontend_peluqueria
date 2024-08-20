import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';  // Asegúrate de importar el componente HomePage
import LoginForm from '../components/LoginForm.vue';
import SignUpForm from '../components/SignUpForm.vue';  // Asegúrate de importar el componente correcto

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    children: [
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
