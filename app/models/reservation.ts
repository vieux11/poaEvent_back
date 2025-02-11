import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Event from './event.js'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  declare clientId: number

  @column()
  declare eventId: number

  // Champ coupon qui contiendra le code généré
  @column()
  declare coupon: string

  @belongsTo(() => User, { foreignKey: 'clientId' })
  declare client: BelongsTo<typeof User>

  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  // Hook appelé avant la création d'une réservation pour générer le coupon
  @beforeCreate()
  public static generateCoupon(reservation: Reservation) {
    if (!reservation.coupon) {
      reservation.coupon = Reservation.generateRandomCoupon(10)
    }
  }
  // Fonction utilitaire pour générer un coupon aléatoire d'une longueur donnée
  public static generateRandomCoupon(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }
}
