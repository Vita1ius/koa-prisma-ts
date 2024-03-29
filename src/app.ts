import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import userRouter from './route/user.router';
import postRouter from './route/post.router';
import postAttachment from './route/postAttachment.router';
import logger from './service/logger';

const app = new Koa();
// Middleware
app.use(bodyParser());
// Routes
app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(postRouter.routes()).use(postRouter.allowedMethods());
app.use(postAttachment.routes()).use(postAttachment.allowedMethods());

// Error handling middleware
app.use((ctx: Context) => {
  ctx.status = ctx.status || 500;
  ctx.body = ctx.body || { error: 'Internal server error' };
});


export default app;