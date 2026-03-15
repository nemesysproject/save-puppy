import type { Request, Response } from "express";
import { CreateShelterCommand } from "@/application/commands/create-shelter.command";
import { DeleteShelterCommand } from "@/application/commands/delete-shelter.command";
import { UpdateShelterCommand } from "@/application/commands/update-shelter.command";
import { GetShelterByIdQuery } from "@/application/queries/get-shelter-by-id.query";
import { GetSheltersQuery } from "@/application/queries/get-shelters.query";
import { mediator } from "@/infrastructure/shared/mediator";

export class ShelterController {
	async create(req: Request, res: Response) {
		try {
			const { name, email, address, latitude, longitude, capacity } = req.body;
			const command = new CreateShelterCommand(
				name,
				email,
				address,
				latitude,
				longitude,
				capacity,
			);
			const result = await mediator.send("CreateShelterCommand", command);
			res.status(201).json(result);
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { name, email, address, latitude, longitude, capacity } = req.body;
			const command = new UpdateShelterCommand(
				id,
				name,
				email,
				address,
				latitude,
				longitude,
				capacity,
			);
			const result = await mediator.send("UpdateShelterCommand", command);
			res.json(result);
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const command = new DeleteShelterCommand(id);
			await mediator.send("DeleteShelterCommand", command);
			res.status(200).json({ message: "Refugio eliminado correctamente" });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async getAll(req: Request, res: Response) {
		try {
			const query = new GetSheltersQuery();
			const result = await mediator.send("GetSheltersQuery", query);
			res.json(result);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async getById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const query = new GetShelterByIdQuery(id);
			const result = await mediator.send("GetShelterByIdQuery", query);

			if (!result) {
				return res.status(404).json({ error: "Refugio no encontrado" });
			}

			res.json(result);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
}
