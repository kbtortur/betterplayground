export const imageToBlob = async (imageURL: string) => {
  const response = await fetch(imageURL)
  const blob = await response.blob()

  return blob
}
