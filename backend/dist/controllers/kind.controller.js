"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KindController = void 0;
const mediator_1 = require("../infrastructure/shared/mediator");
const get_kinds_query_1 = require("../application/queries/get-kinds.query");
class KindController {
    async getKinds(req, res) {
        try {
            const query = new get_kinds_query_1.GetKindsQuery();
            const result = await mediator_1.mediator.send('GetKindsQuery', query);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.KindController = KindController;
