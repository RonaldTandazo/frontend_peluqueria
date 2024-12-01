import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/Authentication/AuthenticationPage.vue";
import LoginForm from "../components/Authentication/LoginForm.vue";
import SignUpForm from "../components/Authentication/SignUpForm.vue";
import RecoveryPage from "@/views/Recovery/RecoveryPage.vue";
import RecoveryForm from "../components/Authentication/RecoveryForm.vue";
import ResetPasswordForm from "@/components/Authentication/ResetPasswordForm.vue";
import SuccessComponent from "@/components/General/SuccessComponent.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import UserDashboard from "@/views/User/UserDashboard.vue";
import UserPage from "@/views/User/UserPage.vue";
import PatientsDashboard from "@/views/Patients/PatientsDashboard.vue";
import PatientsList from "@/views/Patients/PatientsList.vue";
import ScheduleAppoinment from "@/views/Patients/ScheduleAppoinment.vue";

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
    path: "/recovery",
    component: RecoveryPage,
    children: [
      {
        path: "",
        name: "RecoveryForm",
        component: RecoveryForm,
      },
      {
        path: "reset_password",
        name: "ResetPassword",
        component: ResetPasswordForm,
        props: (route) => ({ token: route.query.token }),
      },
    ],
  },
  {
    path: "/success",
    name: "Success",
    component: SuccessComponent,
    props: true,
  },
  {
    path: "/home",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/user",
    component: UserDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: "/user/user_information",
    component: UserPage,
    meta: { requiresAuth: true },
    name: "UserInformation"
  },
  {
    path: "/patients",
    component: PatientsDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/patients/list",
    component: PatientsList,
    meta: { requiresAuth: true },
  },
  {
    path: "/patients/schedule_appoinment",
    component: ScheduleAppoinment,
    meta: { requiresAuth: true },
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
