import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import HomeView from "./views/HomeView.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/setup",
    component: () => import("./views/FirstSetup.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/image-generation",
    name: "Image generation",
    component: () => import("./views/ImageGeneration.vue"),
  },
  {
    path: "/tts",
    name: "Text-to-speech",
    component: () => import("./views/TextToSpeech.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("./views/SettingsView.vue"),
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
      component: () => import("./views/NotFound.vue"),
    },
  ],
})

export default router
