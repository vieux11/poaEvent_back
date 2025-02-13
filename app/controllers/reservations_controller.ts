import type { HttpContext } from '@adonisjs/core/http'

import Reservation from "#models/reservation"
import Event from '#models/event'

export default class ReservationsController {
  /**
   * Récupérer les réservations du client authentifié
   */
  public async getMyReservations({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user || user.role !== 'client') {
      return response.unauthorized({ message: 'Accès réservé aux clients' })
    }

    // Charger les réservations du client, en préchargeant l'événement et le client
    const reservations = await Reservation.query()
      .where('client_id', user.id)
      .preload('event')
      .preload('client')

    // Reformater la réponse pour n'inclure que les infos utiles
    const result = reservations.map((reservation) => ({
      id: reservation.id,
      clientName: reservation.client.fullName, // Nom du client
      eventTitle: reservation.event.title, // Titre de l'événement
      eventDate: reservation.event.eventDate,
      eventLocation: reservation.event.location,
      coupon: reservation.coupon,
      createdAt: reservation.createdAt,
    }))

    return response.ok(result)
  }

  /**
   * Récupérer toutes les réservations (admin uniquement)
   */
  public async getAllReservations({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user || user.role !== 'admin') {
      return response.unauthorized({ message: 'Accès réservé aux administrateurs' })
    }

    // Charger toutes les réservations en préchargeant les relations client et événement
    const reservations = await Reservation.query().preload('client').preload('event')
    // Reformater la réponse pour n'inclure que les infos utiles
    const result = reservations.map((reservation) => ({
      id: reservation.id,
      clientName: reservation.client.fullName, // Nom du client
      eventTitle: reservation.event.title, // Titre de l'événement
      coupon: reservation.coupon,
      createdAt: reservation.createdAt,
    }))

    return response.ok(result)
  }

  /**
   * Créer une réservation (client uniquement)
   */
  public async store({ request, auth, response }: HttpContext) {
    const user = auth.user

    if (!user || user.role !== 'client') {
      return response.unauthorized({ message: 'Accès réservé aux clients' })
    }

    // Récupérer l'id de l'événement à réserver depuis le corps de la requête
    const { eventId } = request.only(['eventId'])

    // Optionnel : Vérifier que l'événement existe
    const event = await Event.find(eventId)
    if (!event) {
      return response.notFound({ message: 'Événement non trouvé' })
    }
    // Créer la réservation (le hook beforeCreate générera automatiquement le coupon)
    const reservation = await Reservation.create({
      clientId: user.id,
      eventId: eventId,
    })
    // Charger les relations pour accéder aux infos de l'événement et du client
    await reservation.load('event')
    await reservation.load('client')

    // Renvoie un objet formaté contenant le titre et la date de l'événement et le nom complet du client
    return response.created({
      id: reservation.id,
      eventTitle: reservation.event.title,
      eventDate: reservation.event.eventDate,
      eventLocation: reservation.event.location,
      clientName: reservation.client.fullName,
      coupon: reservation.coupon,
      createdAt: reservation.createdAt,
    })
  }
}
