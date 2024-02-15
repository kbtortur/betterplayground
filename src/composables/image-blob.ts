export const urlImageToBlob = async (url: string) => {
  const response = await fetch(url)
  const blob = await response.blob()

  return blob
}
