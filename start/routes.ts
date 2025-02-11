/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.group(() => {
  // Création de comptes
  router.post('/register/client', [UsersController, 'createClient'])
  router.post('/register', [UsersController, 'store'])
  router.post('/register/admin', [UsersController, 'createAdmin'])
  // Connexion & Déconnexion
  router.post('/login', [UsersController, 'login'])
  router.post('/logout', [UsersController, 'logout']).use(middleware.auth({ guards: ['api'] }))
})
