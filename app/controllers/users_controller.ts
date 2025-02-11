import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async store({ request }: HttpContext) {
    return User.create(request.all())
  }
  /**
   * Créer un compte client
   */
  public async createClient({ request, response }: HttpContext) {
    const data = request.all()
    const user = await User.create({ ...data, role: 'client' })
    await user.refresh()
    return response.created(user)
  }
  /**
   * Créer un compte admin
   */
  public async createAdmin({ request, response }: HttpContext) {
    const data = request.all()
    const user = await User.create({ ...data, role: 'admin' })
    return response.created(user)
  }

  /**
   * Connexion d'un utilisateur
   */
  public async login({ request }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')
    const userAuth = await User.verifyCredentials(email, password)

    const tokenGenerer = await User.accessTokens.create(userAuth)
    return {
      user: userAuth,
      token: tokenGenerer,
    }
  }

  /**
   * Déconnexion de l'utilisateur (supprime uniquement le token actuel)
   */
  public async logout({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const authResult = await auth.authenticate()
    const token = authResult.currentAccessToken
    await User.accessTokens.delete(user, token?.identifier)

    return { message: 'deconnexion effectué', status: 200 }
  }
}
