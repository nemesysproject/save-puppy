import type { Request, Response } from "express";
import { CreatePetCommand } from "@/application/commands/create-pet.command";
import { DeletePetCommand } from "@/application/commands/delete-pet.command";
import { UpdatePetCommand } from "@/application/commands/update-pet.command";
import { GetPetByIdQuery } from "@/application/queries/get-pet-by-id.query";
import { GetPetsQuery } from "@/application/queries/get-pets.query";
import { SearchPetsByLocationQuery } from "@/application/queries/search-pets-by-location.query";
import { mediator } from "@/infrastructure/shared/mediator";

export class PetController {
	async create(req: Request, res: Response) {
		try {
			const { name, status, kindId, genderId, shelterId, ownerEmail, ownerId, raceId } =
				req.body;
			const command = new CreatePetCommand(
				name,
				status,
				kindId,
				genderId,
				raceId,
				shelterId,
				ownerEmail,
				ownerId,
			);
			const result: any = await mediator.send("CreatePetCommand", command);
			res.status(201).json({
				id: result.id,
				message: "Mascota registrada exitosamente",
				pet: result,
			});
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { name, status, kindId, genderId, shelterId, ownerEmail, ownerId, raceId } =
				req.body;
			const command = new UpdatePetCommand(
				id,
				name,
				status,
				kindId,
				genderId,
				raceId,
				shelterId,
				ownerEmail,
				ownerId,
			);
			const result: any = await mediator.send("UpdatePetCommand", command);
			res.json({
				message: "Mascota actualizada exitosamente",
				pet: result,
			});
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const command = new DeletePetCommand(id);
			await mediator.send("DeletePetCommand", command);
			res.status(200).json({ message: "Mascota eliminada correctamente" });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async getAll(req: Request, res: Response) {
		try {
			const query = new GetPetsQuery();
			const result = await mediator.send("GetPetsQuery", query);
			res.json(result);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async getById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const query = new GetPetByIdQuery(id);
			const result = await mediator.send("GetPetByIdQuery", query);

			if (!result) {
				return res.status(404).json({ error: "Mascota no encontrada" });
			}

			res.json(result);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async searchByLocation(req: Request, res: Response) {
		try {

			const { kindId, lat, lon, radius, raceId, status, withImages } =
				req.body;
			const query = new SearchPetsByLocationQuery(
				typeof lat === 'string' ? parseFloat(lat) : lat,
				typeof lon === 'string' ? parseFloat(lon) : lon,
				typeof radius === 'string' ? parseFloat(radius) : radius,
				kindId,
				raceId,
				status,
				withImages === false ? false : true,
			);
			const result = await mediator.send("SearchPetsByLocationQuery", query);

			res.json(result);
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}
}
