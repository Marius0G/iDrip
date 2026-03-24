import { Router, Request, Response } from 'express';
import { MOCK_RECOMMENDATIONS } from '../seed/data';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { budget, style } = req.query;
  let results = [...MOCK_RECOMMENDATIONS];

  if (budget) {
    const maxBudget = Number(budget);
    results = results.filter((r) => r.price <= maxBudget);
  }

  if (style && typeof style === 'string') {
    const s = style.toLowerCase();
    results = results.filter(
      (r) => r.matchReason.toLowerCase().includes(s) || r.category.includes(s)
    );
  }

  results.sort((a, b) => b.matchScore - a.matchScore);
  res.json({ recommendations: results, count: results.length });
});

export default router;
