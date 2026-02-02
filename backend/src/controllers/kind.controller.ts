import { Request, Response } from 'express';
import { mediator } from '@/infrastructure/shared/mediator';
import { GetKindsQuery } from '@/application/queries/get-kinds.query';

export class KindController {
    async getKinds(req: Request, res: Response) {
        console.log('GET /kinds request received in KindController');
        try {
            const query = new GetKindsQuery();
            const result = await mediator.send('GetKindsQuery', query);
            res.json(result);
        } catch (error: any) {
            console.error('Error processing GET /kinds:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
