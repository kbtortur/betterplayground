export const b64ImageToBlob = async (
  b64Data: string,
  contentType = "image/png",
  sliceSize = 512
) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = Array.from({ length: slice.length })
    for (let index = 0; index < slice.length; index++) {
      byteNumbers[index] = slice.codePointAt(index)
    }

    const byteArray = new Uint8Array(byteNumbers.length)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}

export const urlImageToBlob = async (url: string) => {
  const response = await fetch(url)
  const blob = await response.blob()

  return blob
}
