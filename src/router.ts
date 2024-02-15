import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import HomeView from "./views/home-view.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/setup",
    component: () => import("./views/first-setup.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/image-generation",
    name: "Image generation",
    component: () => import("./views/image-generation.vue"),
  },
  {
    path: "/text-generation",
    name: "Text generation",
    component: () => import("./views/text-generation.vue"),
  },
  {
    path: "/tts",
    name: "Text-to-speech",
    component: () => import("./views/text-to-speech.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("./views/settings-view.vue"),
  },
]
export const routeList = routes.map(({ name, path }) => ({ name, path }))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routes,
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("./views/not-found.vue"),
    },
  ],
})

export default router
