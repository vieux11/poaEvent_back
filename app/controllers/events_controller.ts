import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Reservation from '#models/reservation'
export default class EventsController {
  /**
   * Créer un événement (admin uniquement)
   */
  public async store({ request, response, auth }: HttpContext) {
    const user = auth.user

    if (!user || user.role !== 'admin') {
      return response.unauthorized({ message: 'Accès réservé aux administrateurs' })
    }

    const data = request.all()
    const event = await Event.create({ ...data, adminId: user.id })
    //  Charger le fullName de l'admin
    await event.load('admin')

    return response.created({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      eventDate: event.eventDate,
      image: event.image,
      adminId: event.adminId,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      adminFullName: event.admin.fullName, // ✅ Inclure uniquement fullName
    })
  }

  /**
   * Récupérer tous les événements
   */
  public async index({ response }: HttpContext) {
    const events = await Event.query().preload('admin')

    //  Transformer les résultats pour inclure fullName
    const result = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      eventDate: event.eventDate,
      image: event.image,
      heure: event.heure,
      maxParticipants: event.maxParticipants,
      adminId: event.adminId,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      adminFullName: event.admin.fullName,
    }))

    return response.ok(result)
  }

  /**
   * Récupérer uniquement les événements créés par l'admin authentifié
   */
  public async getMyEvents({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user || user.role !== 'admin') {
      return response.unauthorized({ message: 'Accès réservé aux administrateurs' })
    }

    const events = await Event.query().where('admin_id', user.id).preload('admin')

    // 🔹 Transformer les résultats pour inclure fullName
    const result = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      eventDate: event.eventDate,
      image: event.image,
      heure: event.heure,
      maxParticipants: event.maxParticipants,
      adminId: event.adminId,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      adminFullName: event.admin.fullName,
    }))

    return response.ok(result)
  }

  public async getRemainingSeats({ params, response }: HttpContext) {
    const eventId = params.eventId

    // Récupérer l'événement
    const event = await Event.find(eventId)
    if (!event) {
      return response.notFound({ message: 'Event not found' })
    }

    // Calculer le nombre de places restantes
    const totalReservationsResult = await Reservation.query().where('eventId', eventId).count('* as total')
    const totalReservations = Number(totalReservationsResult[0]?.$extras.total) || 0
    const remainingSeats = event.maxParticipants - totalReservations

    return response.ok({ remainingSeats, totalReservations })
  }

  // Récupérer les réservations pour le tableau de bord de l'admin
  public async dashboard({ params, auth, response }: HttpContext) {
    const user = auth.user!

    const event = await Event.query()
      .where('id', params.id)
      .andWhere('adminId', user.id)
      .preload('reservations', (reservationQuery) => {
        reservationQuery.preload('client')
      })
      .first()

    if (!event) {
      return response.unauthorized({ message: 'Accès interdit ou événement introuvable' })
    }

    const totalPlaces = event.maxParticipants
    const reservedCount = event.reservations.length
    const availablePlaces = totalPlaces - reservedCount

    const reservationList = event.reservations.map((res) => ({
      clientName: res.client.fullName,
      coupon: res.coupon,
    }))

    return {
      eventTitle: event.title,
      totalPlaces,
      reservedCount,
      availablePlaces,
      reservationList,
    }
  }
}
