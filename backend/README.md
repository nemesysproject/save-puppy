# Save Puppy API 🐾

API Backend construida con Node.js y TypeScript implementando el patrón **CQRS** (Command Query Responsibility Segregation) para escalar y separar la lógica de escritura de la de lectura.

## 🎯 Propósito del Proyecto

El objetivo principal de esta plataforma es crear un ecosistema digital integral para el bienestar animal que permita:

1.  **Rescate y Adopción:** Facilitar el rescate de mascotas en situación de calle y gestionar sus procesos de adopción de manera eficiente.
2.  **Mascotas Perdidas:** Proveer herramientas de búsqueda rápida y geolocalización para reunir a mascotas perdidas con sus dueños.
3.  **Coordinación con Refugios:** Interconexión centralizada con refugios privados y gubernamentales para gestionar capacidades y traslados.
4.  **Financiamiento y Recursos:**
    *   Módulo de **Crowdfunding** para recaudar fondos para tratamientos médicos o casos urgentes.
    *   Gestión de publicidad y donaciones de alimentos, servicios veterinarios y apoyos gubernamentales.

## 🏗 Arquitectura y Características Técnicas

Este proyecto utiliza una arquitectura de **Persistencia Políglota** orquestada por eventos para maximizar el rendimiento en búsquedas y la seguridad en transacciones financieras.

### Componentes Principales

*   **PostgreSQL (Write Side / Commands):**
    *   Actúa como la "Fuente de la Verdad" (Source of Truth).
    *   Maneja la integridad transaccional crítica, esencial para el módulo de **Crowdfunding** (dinero) y la gestión de inventarios/cupos de refugios.
    *   Garantiza consistencia ACID.

*   **MongoDB (Read Side / Queries):**
    *   Almacena vistas materializadas (proyecciones) desnormalizadas y optimizadas para la lectura.
    *   Permite búsquedas rápidas y flexibles para la App Móvil.
    *   Utiliza índices geoespaciales (`2dsphere`) para funcionalidades críticas como "buscar mascotas cerca de mí".

*   **RabbitMQ (Event Bus):**
    *   Desacopla las operaciones de escritura y lectura.
    *   Sincroniza los datos entre PostgreSQL y MongoDB mediante eventos de dominio, garantizando **Consistencia Eventual**.

## 🛠 Stack Tecnológico

*   **Lenguaje:** TypeScript / Node.js
*   **Framework Web:** Express
*   **Bases de Datos:** PostgreSQL 16, MongoDB 7.0
*   **Mensajería:** RabbitMQ 3
*   **Infraestructura:** Docker & Docker Compose

## 🚀 Instalación y Ejecución

### Prerrequisitos
*   Node.js (v18+)
*   Docker Desktop o Podman

### Pasos

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Opción A: Desarrollo Local (Infraestructura en Docker, App en Host)**
    Levanta solo las bases de datos y RabbitMQ:
    ```bash
    docker-compose up -d
    ```
    Luego ejecuta la app:
    ```bash
    npm run dev
    ```

3.  **Opción B: Ejecución Full Docker/Podman**
    Levanta toda la aplicación incluyendo la API:
    ```bash
    docker-compose up --build
    ```