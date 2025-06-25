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
import EventsController from '#controllers/events_controller'
import ReservationsController from '#controllers/reservations_controller'

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
//event route groupe

router.get('/events', [EventsController, 'index'])
// Route pour obtenir le nombre de places restantes pour un événement
router.get('/event/:eventId/remainingSeats', [EventsController, 'getRemainingSeats'])
// Création des events
router
  .post('/createEvent', [EventsController, 'store'])
  .use([middleware.auth({ guards: ['api'] }), middleware.isAdmin()])
// récupération des events d'un admin
router
  .get('/getMyEvents', [EventsController, 'getMyEvents'])
  .use([middleware.auth({ guards: ['api'] }), middleware.isAdmin()])
router.group(() => {
  // Création d'une réservation (client uniquement)
  router
    .post('/createReservation', [ReservationsController, 'store'])
    .use([middleware.auth({ guards: ['api'] })])
  // Récupérer les réservations du client authentifié
  router
    .get('/getMyReservations', [ReservationsController, 'getMyReservations'])
    .use([middleware.auth({ guards: ['api'] })])
  // Récupérer toutes les réservations (admin uniquement)
  router
    .get('/events/:id/reservations-dashboard', [EventsController, 'dashboard'])
    .use([middleware.auth({ guards: ['api'] }), middleware.isAdmin()])
})
