import { Context } from 'koa';
import jwt, { VerifyErrors } from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';

function authenticateToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

export async function authenticated(ctx: Context, next: () => Promise<any>) {
  try {
    const authHeader = ctx.header.authorization;
    if (!authHeader) {
      ctx.throw(403, 'Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    const decoded = await authenticateToken(token);
    ctx.state.userId = decoded.userId;

    await next();
  } catch (err) {
    if ((err as VerifyErrors).name === 'JsonWebTokenError') {
      // ctx.throw(401, 'Invalid token');
      ctx.body = {error: '401, \'Invalid token\''}
    } else if ((err as VerifyErrors).name === 'TokenExpiredError') {
      // ctx.throw(401, 'Token expired');
      ctx.body = {error: '401, \'Token expired\''}
    } else {
      // ctx.throw(500, 'Internal server error');
      ctx.body = {error: '500, \'Internal server error\''}
    }
  }
}