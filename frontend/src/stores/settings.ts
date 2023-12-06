import { defineStore } from "pinia"

const DEFAULT_SETTINGS = {
  openaiApiKey: "",
}

export const useSettings = defineStore("settings", {
  state: () => DEFAULT_SETTINGS,
  persist: true,
})
