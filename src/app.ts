import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import userRouter from './route/user.router';

const app = new Koa();
// Middleware
app.use(bodyParser());
// Routes
app.use(userRouter.routes()).use(userRouter.allowedMethods());

// Error handling middleware
app.use((ctx: Context) => {
  ctx.status = ctx.status || 500;
  ctx.body = ctx.body || { error: 'Internal server error' };
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});