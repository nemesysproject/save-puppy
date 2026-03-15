import type { KindEntity } from "@/domain/entities/kind.entity";
import type { IKindRepository } from "@/domain/repositories/kind.repository";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class GetKindsQuery {
	// No properties needed for getting all kinds
}

export class GetKindsHandler implements IHandler<GetKindsQuery, KindEntity[]> {
	constructor(private kindRepository: IKindRepository) {
		console.log("GetKindsHandler initialized with KindRepository");
	}

	async handle(query: GetKindsQuery): Promise<KindEntity[]> {
		return await this.kindRepository.findAll();
	}
}
