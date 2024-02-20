export const b64ImageToBlob = async (b64Data: string, contentType = "image/png") => {
  const response = await fetch(`data:${contentType};base64,${b64Data}`)
  return await response.blob()
}

export const urlImageToBlob = async (url: string) => {
  const response = await fetch(url)
  const blob = await response.blob()

  return blob
}
