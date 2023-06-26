import { createHash,randomBytes } from 'crypto';

export async function hash(password:string) : Promise<string>{
  const passwordHash = createHash('sha256').update(password).digest('hex');
  return passwordHash;
}