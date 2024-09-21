FROM directus/directus:10.10.5

COPY packages extensions
COPY .env .env

