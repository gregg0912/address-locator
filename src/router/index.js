import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/:province*/:municipality*",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/instructions",
    name: "instructions",
    component: () => import("../views/InstructionsView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
