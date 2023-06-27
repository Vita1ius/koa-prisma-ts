import { Context } from 'koa';
import  { VerifyErrors } from 'jsonwebtoken';
import { authenticateToken } from '../service/jwt'

export async function authenticated(ctx: Context, next: () => Promise<any>) {
  try {
    const authHeader = ctx.header.authorization;
    if (!authHeader) {
      ctx.throw(403, 'Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    const decoded = await authenticateToken(token);
    ctx.state.user = decoded.user;

    await next();
  } catch (err) {
    if ((err as VerifyErrors).name === 'JsonWebTokenError') {
      // ctx.throw(401, 'Invalid token');
      ctx.body = {error: '401, \'Invalid token\''};
    } else if ((err as VerifyErrors).name === 'TokenExpiredError') {
      // ctx.throw(401, 'Token expired');
      ctx.body = {error: '401, \'Token expired\''};
    } else {
      // ctx.throw(500, 'Internal server error');
      ctx.body = {error: '500, \'Internal server error\''};
    }
  }
}