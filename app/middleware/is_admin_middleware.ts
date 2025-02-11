import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class IsAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const { auth, response } = ctx

    // Vérifier si l'utilisateur est authentifié
    if (!auth.user) {
      return response.unauthorized({ message: 'Vous devez être connecté' })
    }

    // Vérifier si l'utilisateur a le rôle "admin"
    if (auth.user.role !== 'admin') {
      return response.forbidden({ message: 'Accès réservé aux administrateurs' })
    }

    // Continuer l'exécution de la requête
    return await next()
  }
}
