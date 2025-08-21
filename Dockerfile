FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le code
COPY . .

# Build Adonis (si TypeScript)
RUN npm run build

# Étape finale
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./


ENV HOST=0.0.0.0
EXPOSE 3333

CMD ["node", "build/bin/server.js"]
