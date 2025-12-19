# ------------------------------
# Stage de base
# ------------------------------
    FROM node:22.16-alpine3.22 AS base
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    
    # ------------------------------
    # Stage dev
    # ------------------------------
    FROM base AS dev
    WORKDIR /app
    COPY . .
    COPY entrypoint.back.sh /usr/local/bin/entrypoint.back.sh
    RUN chmod +x /usr/local/bin/entrypoint.back.sh
    
    EXPOSE 3000
    ENTRYPOINT ["/usr/local/bin/entrypoint.back.sh"]
    CMD ["node", "server.js"]
    