import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/:pathMatch(.*)*", component: Home }, // ← Catch all paths
];

const router = createRouter({
  history: createWebHistory(), // base "/" is fine
  routes,
});

export default router;
