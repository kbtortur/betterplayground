interface LocalStored {
  encryptedApiToken: string
}
export function ls<L extends keyof LocalStored>(key: L): LocalStored[L] | null
export function ls<L extends keyof LocalStored>(key: L, value: LocalStored[L]): void
export function ls<L extends keyof LocalStored>(
  key: L,
  value?: LocalStored[L]
): LocalStored[L] | null {
  return value === undefined
    ? JSON.parse(localStorage.getItem(`bpg-${key}`) as string)
    : localStorage.setItem(`bpg-${key}`, JSON.stringify(value))
}
