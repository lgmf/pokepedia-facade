import { Request, Response } from 'firebase-functions';

export function cors(req: Request, res: Response) {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
  }
}
