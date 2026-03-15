import type { Request, Response } from "express";
import { GetGendersQuery } from "@/application/queries/get-genders.query";
import { mediator } from "@/infrastructure/shared/mediator";

export class GenderController {
	async getGenders(req: Request, res: Response) {
		console.log("GET /genders request received in GenderController");
		try {
			const query = new GetGendersQuery();
			const result = await mediator.send("GetGendersQuery", query);
			res.json(result);
		} catch (error: any) {
			console.error("Error processing GET /genders:", error);
			res.status(500).json({ error: error.message });
		}
	}
}
