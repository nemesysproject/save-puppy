import type { Request, Response } from "express";
import { CreateMediaCommand } from "@/application/commands/create-media.command";
import { DeleteMediaCommand } from "@/application/commands/delete-media.command";
import { GetMediaByLocationQuery } from "@/application/queries/get-media-by-location.query";
import { GetMediaByPetQuery } from "@/application/queries/get-media-by-pet.query";
import type { CloudinaryService } from "@/infrastructure/services/cloudinary.service";
import { computeGeohash } from "@/infrastructure/services/geohash.service";
import { mediator } from "@/infrastructure/shared/mediator";

export class MediaController {
	constructor(private cloudinaryService: CloudinaryService) {}

	create = async (req: Request, res: Response) => {
		try {
			if (!req.file) {
				return res
					.status(400)
					.json({ error: "No se ha proporcionado ninguna imagen" });
			}

			const { petId } = req.params;
			if (!petId) {
				return res.status(400).json({ error: "petId es requerido en la URL" });
			}

			// Validar cantidad máxima de fotos permitidas (10)
			const existingMediaQuery = new GetMediaByPetQuery(petId);
			const existingMedia = (await mediator.send(
				"GetMediaByPetQuery",
				existingMediaQuery,
			)) as any[];

			if (existingMedia.length >= 10) {
				return res.status(400).json({
					error: "Límite máximo de 10 archivos multimedia por mascota alcanzado",
				});
			}

			// 1. Subir imagen a Cloudinary
			const { url, publicId } = await this.cloudinaryService.uploadImage(
				req.file.buffer,
			);

			// 2. Calcular Geohash basado en las coordenadas pasadas si existen
			const lat =
				req.body.latitude !== undefined ? parseFloat(req.body.latitude) : null;
			const lon =
				req.body.longitude !== undefined
					? parseFloat(req.body.longitude)
					: null;
			const precisionRequested =
				req.body.precisionMeters !== undefined
					? parseInt(req.body.precisionMeters, 10)
					: 100;

			let geohash: string | null = null;
			if (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon)) {
				const precision = Math.max(10, Math.min(100, precisionRequested));
				geohash = computeGeohash(lat, lon, precision);
				console.log(`[Media CREATE] lat=${lat}, lon=${lon}, precision=${precision}m, geohash=${geohash}`);
			} else {
				console.log(`[Media CREATE] No coordinates provided. lat=${lat}, lon=${lon}`);
			}

			// 3. Emitir comando a base de datos
			const command = new CreateMediaCommand(
				url,
				publicId,
				"CLOUDINARY", // provider
				"IMAGE", // type
				lat ?? 0, // latitude
				lon ?? 0, // longitude
				geohash,
				petId,
			);

			const result = await mediator.send("CreateMediaCommand", command);
			res.status(201).json(result);
		} catch (error: any) {
			console.error("Error creating media:", error);
			res.status(500).json({ error: "Error interno al procesar media" });
		}
	};


	delete = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const command = new DeleteMediaCommand(id);
			await mediator.send("DeleteMediaCommand", command);
			res.status(200).json({ message: "Media eliminado correctamente" });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	};

	getByPetId = async (req: Request, res: Response) => {
		try {
			const { petId } = req.params;
			const query = new GetMediaByPetQuery(petId);
			const result = await mediator.send("GetMediaByPetQuery", query);
			res.json(result);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	};

	searchByImage = async (req: Request, res: Response) => {
		try {
			if (!req.file) {
				return res
					.status(400)
					.json({ error: "No se ha proporcionado ninguna imagen" });
			}

			const lat =
				req.body.latitude !== undefined ? parseFloat(req.body.latitude) : null;
			const lon =
				req.body.longitude !== undefined
					? parseFloat(req.body.longitude)
					: null;
			const precisionRequested =
				req.body.precisionMeters !== undefined
					? parseInt(req.body.precisionMeters, 10)
					: 100;

			if (lat === null || lon === null || isNaN(lat) || isNaN(lon)) {
				return res
					.status(400)
					.json({ error: "latitude y longitude son requeridos" });
			}

			const precision = Math.max(10, Math.min(100, precisionRequested));
			const geohash = computeGeohash(lat, lon, precision);

			const limit =
				req.body.limit !== undefined ? parseInt(req.body.limit, 10) : 50;
			const query = new GetMediaByLocationQuery(geohash, limit);
			const results = (await mediator.send(
				"GetMediaByLocationQuery",
				query,
			)) as any[];

			res.json({ geohash, count: results.length, results });
		} catch (error: any) {
			console.error("Error searching media by image:", error);
			res.status(500).json({ error: "Error interno al buscar media" });
		}
	};
}
