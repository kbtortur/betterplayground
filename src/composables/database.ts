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

  textGenerationChat: {
    value: ChatInterfaceMessage & { id?: number }
    key: number
    indexes: {
      "by-id": number
      "by-text": number
    }
  }
}

export const database = await openDB<BPGSchema>("betterplayground", 2, {
  upgrade(database) {
    if (!database.objectStoreNames.contains("imageGenerationChat")) {
      const imageGenerationChat = database.createObjectStore("imageGenerationChat", {
        autoIncrement: true,
        keyPath: "id",
      })

      imageGenerationChat.createIndex("by-id", "id", { unique: true })
      imageGenerationChat.createIndex("by-text", "text")
    }

    if (!database.objectStoreNames.contains("textGenerationChat")) {
      const textGenerationChat = database.createObjectStore("textGenerationChat", {
        autoIncrement: true,
        keyPath: "id",
      })

      textGenerationChat.createIndex("by-id", "id", { unique: true })
      textGenerationChat.createIndex("by-text", "text")
    }
  },
})

type AvailableStores = Parameters<typeof database.put>[0]
export const loadStoredMessages = async <T extends AvailableStores>(storeName: T) => {
  const history: ChatInterfaceMessage[] = []

  const transaction = database.transaction(storeName)
  if (!transaction?.store) throw new Error(`Store ${storeName} not found`)

  const index = transaction.store.index("by-id")
  let cursor = await index.openCursor(undefined, "prev")

  while (cursor) {
    const { value, key } = cursor
    if (typeof key !== "number") throw new Error("Unexpected key")

    // discard loading messages in database
    if (value.loadingUUID) {
      const message: ChatInterfaceMessage = {
        from: "robot",
        text: "Sorry, I lost this message.",
      }
      database.put(storeName, { ...message, id: key })
      history.push(message)
    } else {
      history.push(value)
    }

    cursor = await cursor.continue()
  }

  return history
}
