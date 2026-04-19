use utoipa::OpenApi;
use crate::api::handlers::pet_handler;
use crate::domain::entities;
use crate::application::commands::create_pet;
use crate::application::queries::search_pets_nearby;
use crate::application::queries::search_pets_by_image;
use crate::recognition::models;

#[derive(OpenApi)]
#[openapi(
    paths(
        pet_handler::create_pet,
        pet_handler::get_pet,
        pet_handler::search_pets,
        pet_handler::search_by_image,
    ),
    components(
        schemas(
            entities::Pet,
            entities::PetStatus,
            create_pet::CreatePetCommand,
            search_pets_nearby::SearchPetsNearbyQuery,
            search_pets_by_image::SearchPetsByImageQuery,
            models::ComparisonResult,
        )
    ),
    tags(
        (name = "pets", description = "Operaciones de gestión de mascotas"),
        (name = "search", description = "Búsquedas avanzadas (Geo + Imagen)")
    ),
    info(
        title = "Save Puppy Unified API",
        version = "0.1.0",
        description = "Monolito de alto rendimiento para rescate animal y reconocimiento de mascotas. Documentación autogenerada con Utoipa.",
        contact(
            name = "Soporte Save Puppy",
            email = "soporte@savepuppy.com"
        )
    )
)]
pub struct ApiDoc;
