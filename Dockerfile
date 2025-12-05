# Stage 1 : Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le projet et builder Next.js
COPY . .
RUN npm run build

# Stage 2 : Production
FROM node:20-alpine AS runner

WORKDIR /app

# Variables d'environnement
ENV NODE_ENV=production

# Copier build et fichiers nécessaires
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Installer uniquement les dépendances production
RUN npm install --omit=dev

# Exposer le port utilisé par Next.js
EXPOSE 3000

# Lancer Next.js en production
CMD ["npx", "next", "start", "-p", "3000"]
