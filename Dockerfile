# ------------------------------
# Stage de base
# ------------------------------
    FROM node:22.16-alpine3.22 AS base
    WORKDIR /app
    COPY package*.json /
    RUN npm ci
    
    # ------------------------------
    # Stage dev
    # ------------------------------
    FROM base AS dev
    WORKDIR /app
    COPY / .
    COPY entrypoint.sh /usr/local/bin/entrypoint.sh
    RUN chmod +x /usr/local/bin/entrypoint.sh
    
    EXPOSE 4200
    ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
    CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
    