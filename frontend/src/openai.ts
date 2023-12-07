import OpenAI from "openai"
import { useRouter } from "vue-router"
import { useSettings } from "./stores/settings"

export const getOpenAI = () => {
  const router = useRouter()
  const settings = useSettings()

  const apiKey = settings.openaiApiKey

  if (!apiKey) {
    router.replace("/setup")
    throw new Error("OpenAI API key not set")
  }

  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
}
