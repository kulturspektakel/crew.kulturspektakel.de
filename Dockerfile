FROM directus/directus:10.10.5

COPY packages extensions
COPY node_modules/directus-extension-directus-operation-slugify extensions/directus-extension-directus-operation-slugify
COPY .env .env

