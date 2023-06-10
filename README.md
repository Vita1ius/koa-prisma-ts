# koa-prisma-ts
Cтворити файл .env і добавити DATABASE_URL="postgresql://postgres:postgres@localhost:5432/db_user?schema=public"

зразок: DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

Також добавити такі дані в .env
AWS_BUCKET_NAME=''
AWS_BUCKET_REGION=''
AWS_ACCESS_KEY=''
AWS_SECRET_ACCESS_KEY=''


EMAIL_USER =''
SENDGRID_API_KEY=''

Команди для запуску:

1. npm install

2. docker-compose up

3. npx prisma migrate dev --name init

4. npm run local
