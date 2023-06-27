import jwt, { VerifyErrors } from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';

export function authenticateToken(token: string): Promise<any> {
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