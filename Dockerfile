FROM directus/directus:11.1.0
ENV HOST 0.0.0.0
COPY packages extensions
