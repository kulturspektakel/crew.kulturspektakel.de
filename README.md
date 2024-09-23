```
npm install
npx dotenv-vault pull
npm run build
colima start
docker build -t crew:latest .
docker run -p 8055:8055 crew:latest --env-file ./.env
```
