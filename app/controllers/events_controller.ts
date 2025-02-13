import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
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
      adminId: event.adminId,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      adminFullName: event.admin.fullName,
    }))

    return response.ok(result)
  }
}
