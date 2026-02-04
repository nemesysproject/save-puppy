"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenderController = void 0;
const mediator_1 = require("../infrastructure/shared/mediator");
const get_genders_query_1 = require("../application/queries/get-genders.query");
class GenderController {
    async getGenders(req, res) {
        console.log('GET /genders request received in GenderController');
        try {
            const query = new get_genders_query_1.GetGendersQuery();
            const result = await mediator_1.mediator.send('GetGendersQuery', query);
            res.json(result);
        }
        catch (error) {
            console.error('Error processing GET /genders:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
exports.GenderController = GenderController;
