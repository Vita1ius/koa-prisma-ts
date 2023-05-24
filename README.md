# koa-prisma-ts
Cтворити файл .env і добавити DATABASE_URL="postgresql://postgres:postgres@localhost:5432/db_user?schema=public"

зразок: DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

Команди для запуску:

1. npm install

2. docker-compose up

3. npx prisma migrate dev --name init

4. npm run local
