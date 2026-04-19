use crate::domain::entities::Pet;
use crate::domain::repositories::{PetRepository, RepoResult, RepositoryError};
use sqlx::PgPool;
use uuid::Uuid;
use async_trait::async_trait;

pub struct PostgresPetRepository {
    pool: PgPool,
}

impl PostgresPetRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl PetRepository for PostgresPetRepository {
    async fn save(&self, pet: Pet) -> RepoResult<Pet> {
        sqlx::query_as::<_, Pet>(
            r#"
            INSERT INTO "Pet" (id, name, status, "kindId", "genderId", "raceId", "shelterId", "ownerId", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                status = EXCLUDED.status,
                "updatedAt" = NOW()
            RETURNING id, name, status, "ownerEmail" as owner_email, "kindId" as kind_id, "raceId" as race_id, "genderId" as gender_id, "shelterId" as shelter_id, "ownerId" as owner_id, "createdAt" as created_at, "updatedAt" as updated_at
            "#
        )
        .bind(pet.id)
        .bind(pet.name)
        .bind(pet.status)
        .bind(pet.kind_id)
        .bind(pet.gender_id)
        .bind(pet.race_id)
        .bind(pet.shelter_id)
        .bind(pet.owner_id)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| RepositoryError::DatabaseError(e.to_string()))
    }

    async fn find_by_id(&self, id: Uuid) -> RepoResult<Option<Pet>> {
        sqlx::query_as::<_, Pet>(
            r#"
            SELECT id, name, status, "ownerEmail" as owner_email, "kindId" as kind_id, "raceId" as race_id, "genderId" as gender_id, "shelterId" as shelter_id, "ownerId" as owner_id, "createdAt" as created_at, "updatedAt" as updated_at
            FROM "Pet"
            WHERE id = $1
            "#
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| RepositoryError::DatabaseError(e.to_string()))
    }

    async fn list_by_shelter(&self, shelter_id: Uuid) -> RepoResult<Vec<Pet>> {
        sqlx::query_as::<_, Pet>(
            r#"
            SELECT id, name, status, "ownerEmail" as owner_email, "kindId" as kind_id, "raceId" as race_id, "genderId" as gender_id, "shelterId" as shelter_id, "ownerId" as owner_id, "createdAt" as created_at, "updatedAt" as updated_at
            FROM "Pet"
            WHERE "shelterId" = $1
            "#
        )
        .bind(shelter_id)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| RepositoryError::DatabaseError(e.to_string()))
    }

    async fn delete(&self, id: Uuid) -> RepoResult<()> {
        sqlx::query(r#"DELETE FROM "Pet" WHERE id = $1"#)
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(|e| RepositoryError::DatabaseError(e.to_string()))?;
        Ok(())
    }
}
