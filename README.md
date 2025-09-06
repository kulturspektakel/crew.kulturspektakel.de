```
npm install
npx dotenvx decrypt -f .env.enc --stdout > .env
npm run build
colima start
docker build -t crew:latest .
docker run -p 8055:8055 -v ./.env:/directus/.env crew:latest
```
