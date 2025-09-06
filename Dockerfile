FROM directus/directus:11.11
ENV HOST 0.0.0.0
COPY packages extensions
