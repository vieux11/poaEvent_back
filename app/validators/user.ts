import vine from '@vinejs/vine'
export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(6).maxLength(255), // full_name doit être une chaîne de caractères avec au moins 6 caractères et au maximum 255
    email: vine.string().trim().email().maxLength(254), // email doit être une chaîne valide et trimée
    password: vine.string().minLength(6), // password doit être une chaîne avec au moins 6 caractères
    role: vine.enum(['admin', 'client']),
  })
)
