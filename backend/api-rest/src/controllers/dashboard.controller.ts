import { Request, Response } from 'express';
import { mediator } from '@/infrastructure/shared/mediator';
import { GetDashboardStatsQuery } from '@/application/queries/get-dashboard-stats.query';

export class DashboardController {
    async getStats(req: Request, res: Response) {
        try {
            const query = new GetDashboardStatsQuery();
            const result = await mediator.send('GetDashboardStatsQuery', query);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
