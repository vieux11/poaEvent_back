import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('description')
      table.string('location').notNullable()
      table.dateTime('event_date').notNullable()
      table.string('image').nullable()
      // Ajout de la clé étrangère admin_id pour l'admin qui crée l'événement
      table.integer('admin_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
