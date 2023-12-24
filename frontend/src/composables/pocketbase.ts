import PocketBase from "pocketbase"

const ADMIN_EMAIL = "betterplayground@vaaski.dev"
const ADMIN_PASSWORD = "betterplayground"
const POCKETBASE_ADDRESS = "http://127.0.0.1:7823"

const getPocketbase = async () => {
  const pb = new PocketBase(POCKETBASE_ADDRESS)

  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
  } catch {
    await pb.admins.create({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      passwordConfirm: ADMIN_PASSWORD,
      avatar: 0,
    })
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
    await pb.settings.update({
      meta: {
        appName: "betterplayground",
        appUrl: POCKETBASE_ADDRESS,
      },
    })
  }

  return pb
}

export const pb = await getPocketbase()
