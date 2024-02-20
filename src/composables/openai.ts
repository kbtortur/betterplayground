import OpenAI from "openai"

import { useSettings } from "@/stores/settings"
import { useRouter } from "vue-router"

export const getOpenAI = () => {
  const router = useRouter()
  const settings = useSettings()

  const apiKey = settings.openaiApiKey

  if (!apiKey) {
    router.replace("/settings")
    // throw new Error("OpenAI API key not set")
  }

  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
}
