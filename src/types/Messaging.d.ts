type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

type ChatInterfaceMessage = {
  isRequest: boolean
} & XOR<{ text: string; imageURL?: string }, { loadingUUID?: string }>

type DatabaseMessage = ChatInterfaceMessage & {
  collectionId: string
  collectionName: string
  id: string
  created: string
  updated: string

  image?: string
}
