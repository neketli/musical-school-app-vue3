import { createRouter, createWebHashHistory } from "vue-router";
import {
  AuthView,
  HomeView,
  SetupView,
  BackupView,
  ErrorView,
  ProfileView,
  VedomostiView,
  DiaryView,
} from "@/views";
import store from "@/store";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/auth",
      name: "auth",
      component: AuthView,
      meta: {
        notAuthorized: true,
      },
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/vedomosti",
      name: "vedomosti",
      component: VedomostiView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/dnevnik",
      name: "diary",
      component: DiaryView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/setup",
      name: "setup",
      component: SetupView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/backup",
      name: "backup",
      component: BackupView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "error",
      component: ErrorView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLogged) {
      to.path === "/auth" ? next("/") : next();
      if (to.path === "/backup" && store.getters.getUserInfo.role !== "admin") {
        next("/");
      }
      return;
    }
    next("/auth");
  } else {
    if (to.matched.length === 0) {
      next("/404");
    }
    next();
  }
});

export default router;
