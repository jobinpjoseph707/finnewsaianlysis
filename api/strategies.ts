import { VercelRequest, VercelResponse } from '@vercel/node';
import { StrategyRepository } from '../server/mcp/strategy-repository';

const strategyRepository = new StrategyRepository();

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json(strategyRepository.getStrategies());
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
