import { VercelRequest, VercelResponse } from '@vercel/node';
import { StrategyRepository } from '../lib/strategy-repository';

const strategyRepository = new StrategyRepository();

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json({
      successRate: '76%',
      avgReturn: '+12.4%',
      activeStrategies: strategyRepository.getActiveStrategyCount(),
      topPerforming: strategyRepository.getTopPerformingStrategies(),
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
