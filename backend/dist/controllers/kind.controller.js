"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KindController = void 0;
const mediator_1 = require("../infrastructure/shared/mediator");
const get_kinds_query_1 = require("../application/queries/get-kinds.query");
class KindController {
    async getKinds(req, res) {
        console.log('GET /kinds request received in KindController');
        try {
            const query = new get_kinds_query_1.GetKindsQuery();
            const result = await mediator_1.mediator.send('GetKindsQuery', query);
            res.json(result);
        }
        catch (error) {
            console.error('Error processing GET /kinds:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
exports.KindController = KindController;
