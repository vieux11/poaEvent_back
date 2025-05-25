import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
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
}
