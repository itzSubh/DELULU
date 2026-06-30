# ---------- Stage 1 : Build React/Vite ----------
FROM node:22-bookworm-slim AS frontend-build

WORKDIR /app/frontend

COPY Frontend/package*.json ./
RUN npm install

COPY Frontend/ .

ENV VITE_API_URL=

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN npm run build


# ---------- Stage 2 : Runtime ----------
FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY Backend/package*.json ./
RUN npm install --omit=dev

COPY Backend/ .

COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001

CMD ["node", "index.js"]