import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/Authentication/AuthenticationPage.vue";
import LoginForm from "../components/Authentication/LoginForm.vue";
import SignUpForm from "../components/Authentication/SignUpForm.vue";
import ClientesView from "@/views/Clientes/ClientesView.vue";
import CitasView from "@/views/Citas/CitasView.vue";
import ReportesView from "@/views/Reportes/ReportesView.vue";

const routes = [
  {
    path: "/",
    component: HomePage,
    children: [
      {
        path: "",
        redirect: "login",
      },
      {
        path: "login",
        name: "LoginForm",
        component: LoginForm,
      },
      {
        path: "signup",
        name: "SignUp",
        component: SignUpForm,
      },
    ],
  },
  {
    path: "/home",
    component: ClientesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/citas",
    component: CitasView,
    meta: { requiresAuth: true },
  },
  {
    path: "/reportes",
    component: ReportesView,
    meta: { requiresAuth: true }
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem("jwt");
    if (!token) {
      next({ name: "LoginForm" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
