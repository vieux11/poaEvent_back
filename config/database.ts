import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: env.get('DB_CONNECTION', 'pg'), // Définit pg comme valeur par défaut
  connections: {
    //   mysql: {
    //     client: 'mysql2',
    //     connection: {
    //       host: env.get('DB_HOST'),
    //       port: env.get('DB_PORT'),
    //       user: env.get('DB_USER'),
    //       password: env.get('DB_PASSWORD'),
    //       database: env.get('DB_DATABASE'),
    //     },
    //     migrations: {
    //       naturalSort: true,
    //       paths: ['database/migrations'],
    //     },
    //   },

    pg: {
      client: 'pg',
      connection: {
        host: env.get('PG_HOST'),
        port: 5432,
        user: env.get('PG_USER'),
        password: env.get('PG_PASSWORD'),
        database: env.get('PG_DB_NAME'),
        ssl: { rejectUnauthorized: false }, // <-- Ajoutez cette ligne
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
