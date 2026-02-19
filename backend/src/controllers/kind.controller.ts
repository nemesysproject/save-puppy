import { Request, Response } from 'express';
import { mediator } from '@/infrastructure/shared/mediator';
import { GetKindsQuery } from '@/application/queries/get-kinds.query';

export class KindController {
    async getKinds(req: Request, res: Response): Promise<void> {
        try {
            const query = new GetKindsQuery();
            const kinds = await mediator.send('GetKindsQuery', query);
            res.status(200).json(kinds);
        } catch (error) {
            console.error('Error fetching kinds:', error);
            res.status(500).json({ 
                error: 'Failed to fetch kinds',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
