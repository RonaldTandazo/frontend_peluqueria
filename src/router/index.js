import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import SignUp from '../components/SignUpForm.vue';  // Asegúrate de importar el componente correcto

const routes = [
  {
    path: '/login',
    name: 'LoginForm',
    component: LoginForm,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,  // Usa el componente SignUp en lugar de HomePage
  },
  {
    path: '/:pathMatch(.*)*',  // Ruta de captura para rutas inexistentes
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
