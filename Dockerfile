#******************
# Builder Stage   *
#******************

FROM node:current-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@latest
RUN npm install --quiet --no-optional --no-fund --loglevel=error

COPY . .
COPY ./.env.prod .env

RUN npm run build 

#*****************
# Runtime Stage  *
#*****************

FROM node:current-alpine AS runtime

# Only necessary build files  
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exposed PORT 
EXPOSE 3000

# Boot Command
CMD ["npm", "run", "start:prod"]