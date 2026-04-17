# AnimeVision

AnimeVision es una aplicación web que recomienda anime a partir de una imagen. El usuario crea una cuenta, inicia sesión, sube una imagen y el sistema usa un servicio de IA para detectar etiquetas visuales. Con esas etiquetas, el back-end consulta AniList y devuelve recomendaciones de anime. Además, el usuario puede guardar favoritos y consultar su historial.

## Tecnologías

- Front-end: React + Vite + React Router
- Back-end: Node.js + Express
- Base de datos: MongoDB Atlas + Mongoose
- IA: FastAPI + CLIP (zero-shot image classification)
- Autenticación: JWT + bcryptjs
- API externa: AniList GraphQL
- Despliegue sugerido: Vercel o Render para front, Render para back e IA, MongoDB Atlas para BD

## Estructura del proyecto

```text
animevision-complete/
├── frontend/
├── backend/
├── ai-service/
├── docs/
├── README.md
└── render.yaml
```

## Variables de entorno

### Front-end (`frontend/.env`)

```env
VITE_API_URL=http://localhost:4000
```

### Back-end (`backend/.env`)

```env
PORT=4000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/animevision
JWT_SECRET=pon_aqui_una_clave_larga
AI_SERVICE_URL=http://localhost:8000
ANILIST_URL=https://graphql.anilist.co
FRONTEND_URL=http://localhost:5173
```

### IA (`ai-service/.env`)

No es obligatorio. El servicio funciona con valores por defecto.

## Cómo ejecutar el proyecto localmente

### 1. Clonar e instalar dependencias

#### Front-end

```bash
cd frontend
npm install
```

#### Back-end

```bash
cd backend
npm install
```

#### IA

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate   # Linux / macOS
# .venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

### 2. Ejecutar servicios

#### IA

```bash
cd ai-service
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Back-end

```bash
cd backend
npm run dev
```

#### Front-end

```bash
cd frontend
npm run dev
```

## Flujo del sistema

1. El usuario se registra o inicia sesión.
2. Sube una imagen desde el dashboard.
3. El back-end manda la imagen al servicio de IA.
4. La IA detecta etiquetas visuales como `shonen action anime`, `martial arts anime`, etc.
5. El back-end transforma esas etiquetas en géneros/tags para AniList.
6. Se consultan recomendaciones y se muestran al usuario.
7. El usuario puede guardar favoritos y revisar su historial.

## Guía de despliegue

### Opción recomendada

- Front-end: Vercel o Render Static Site
- Back-end: Render Web Service
- IA: Render Web Service
- Base de datos: MongoDB Atlas

### Pasos generales

1. Subir el repositorio a GitHub.
2. Crear una base de datos en MongoDB Atlas y copiar la cadena `MONGODB_URI`.
3. Desplegar el servicio de IA en Render.
4. Desplegar el back-end en Render configurando `AI_SERVICE_URL`, `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`.
5. Desplegar el front-end en Vercel o Render configurando `VITE_API_URL` con la URL del back-end.

## Endpoints principales

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Recomendaciones

- `POST /api/recommendations` (requiere JWT)

### Favoritos

- `GET /api/favorites`
- `POST /api/favorites`
- `DELETE /api/favorites/:anilistId`

### Historial

- `GET /api/history`

## Mejoras futuras

- Entrenar un modelo con posters reales de anime
- Guardar imágenes en Cloudinary o S3
- Sistema de calificación y reseñas
- Filtro por temporada, estudio y año
- Explicaciones más avanzadas de por qué se recomendó cada anime

## Archivos académicos

- Reporte: `docs/reporte.md`
- Presentación: `docs/presentacion.md`
