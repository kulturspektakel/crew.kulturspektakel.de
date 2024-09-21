FROM directus/directus:11.1.0

COPY packages extensions
COPY .env .env

