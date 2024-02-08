import type { DBSchema } from "idb"
import { openDB } from "idb"

interface BPGSchema extends DBSchema {
  imageGenerationChat: {
    value: ChatInterfaceMessage & { id?: number }
    key: number
    indexes: {
      "by-id": number
      "by-text": number
    }
  }
}

export const db = await openDB<BPGSchema>("betterplayground", 1, {
  upgrade(db) {
    const imageGenerationChat = db.createObjectStore("imageGenerationChat", {
      autoIncrement: true,
      keyPath: "id",
    })

    imageGenerationChat.createIndex("by-id", "id", { unique: true })
    imageGenerationChat.createIndex("by-text", "text")
  },
})

type AvailableStores = Parameters<typeof db.put>[0]
export const loadStoredMessages = async <T extends AvailableStores>(storeName: T) => {
  const history: ChatInterfaceMessage[] = []

  const transaction = db.transaction(storeName)
  if (!transaction?.store) throw new Error(`Store ${storeName} not found`)

  const index = transaction.store.index("by-id")
  let cursor = await index.openCursor(null, "prev")

  while (cursor) {
    const { value, key } = cursor
    if (typeof key !== "number") throw new Error("Unexpected key")

    // discard loading messages in database
    if (value.loadingUUID) {
      const message: ChatInterfaceMessage = {
        from: "robot",
        text: "Sorry, I lost this message.",
      }
      db.put(storeName, { ...message, id: key })
      history.push(message)
    } else {
      history.push(value)
    }

    cursor = await cursor.continue()
  }

  return history
}
