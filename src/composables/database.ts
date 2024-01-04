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
