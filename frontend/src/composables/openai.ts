import OpenAI from "openai"

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
