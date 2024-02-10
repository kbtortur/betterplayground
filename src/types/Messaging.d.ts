type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

type ChatInterfaceMessage = {
  from: "human" | "robot"
} & XOR<{ text: string; image?: Blob }, { text?: string; loadingUUID?: string }>
