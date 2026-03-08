import { prisma } from '@/infrastructure/database/prisma';

export class GetDashboardStatsQuery {
    constructor() {}
}

export interface DashboardStats {
    totalPets: number;
    totalShelters: number;
    totalUsers: number;
    totalAdoptions: number;
    petsByStatus: {
        lost: number;
        adoption: number;
        found: number;
    };
    adoptionsByStatus: {
        pending: number;
        approved: number;
        rejected: number;
    };
}

export class GetDashboardStatsHandler {
    async handle(): Promise<DashboardStats> {
        const [totalPets, totalShelters, totalUsers, totalAdoptions, petsByStatus, adoptionsByStatus] = await Promise.all([
            prisma.pet.count(),
            prisma.shelter.count(),
            prisma.user.count(),
            prisma.adoption.count(),
            
            prisma.pet.groupBy({
                by: ['status'],
                _count: true
            }),
            
            prisma.adoption.groupBy({
                by: ['status'],
                _count: true
            })
        ]);

        const petsStatusMap: Record<string, number> = petsByStatus.reduce((acc, item: any) => {
            acc[item.status.toLowerCase()] = item._count;
            return acc;
        }, {} as Record<string, number>);

        const adoptionsStatusMap: Record<string, number> = adoptionsByStatus.reduce((acc, item: any) => {
            acc[item.status.toLowerCase()] = item._count;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalPets,
            totalShelters,
            totalUsers,
            totalAdoptions,
            petsByStatus: {
                lost: petsStatusMap['lost'] || 0,
                adoption: petsStatusMap['adoption'] || 0,
                found: petsStatusMap['found'] || 0
            },
            adoptionsByStatus: {
                pending: adoptionsStatusMap['pending'] || 0,
                approved: adoptionsStatusMap['approved'] || 0,
                rejected: adoptionsStatusMap['rejected'] || 0
            }
        };
    }
}
