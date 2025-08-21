import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Reservation from './reservation.js'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare location: string

  @column.dateTime()
  declare eventDate: DateTime

  @column.dateTime()
  declare heure: DateTime // Nouvelle colonne pour l'heure de la réservation

  @column()
  declare maxParticipants: number // Nouvelle colonne pour le nombre maximum de participants

  @column()
  declare image: string

  // admin_id est stocké en base pour référencer le compte admin qui a créé l'événement
  @column()
  declare adminId: number

  @belongsTo(() => User, { foreignKey: 'adminId' })
  declare admin: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Reservation)
  declare reservations: HasMany<typeof Reservation>

  // Champ calculé pour les places restantes
  @computed()
  public async remainingSeats() {
    // Si l'événement n'est pas encore sauvegardé, retourner maxParticipants
    if (!this.id) {
      return this.maxParticipants
    }

    // Compter les réservations pour cet événement
    const reservationsCount = await Reservation.query()
      .where('event_id', this.id)
      .count('* as total')
      .first()

    const totalReservations = Number(reservationsCount?.$extras.total || 0)
    return this.maxParticipants - totalReservations
  }

  // Méthode utilitaire pour rafraîchir les places restantes
  public async refreshRemainingSeats(): Promise<number> {
    const reservationsCount = await Reservation.query()
      .where('event_id', this.id)
      .count('* as total')
      .first()

    const totalReservations = Number(reservationsCount?.$extras.total || 0)
    return this.maxParticipants - totalReservations
  }
}
