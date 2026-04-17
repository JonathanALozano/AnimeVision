# Reporte del proyecto: AnimeVision

## 1. Nombre del proyecto
AnimeVision: recomendador de anime por imagen con inteligencia artificial.

## 2. Planteamiento del problema
Muchas personas quieren descubrir anime nuevo, pero normalmente dependen de listas generales o recomendaciones manuales. El problema es que no siempre saben cómo describir el estilo visual o el tipo de anime que desean ver. Por eso se propone un sistema que reciba una imagen y recomiende animes con una estética o género similar.

## 3. Objetivo general
Desarrollar una aplicación web con front-end, back-end, autenticación y un módulo de inteligencia artificial que recomiende animes a partir del análisis de imágenes.

## 4. Objetivos específicos
- Implementar una interfaz amigable para registro, login y consulta de recomendaciones.
- Construir una API segura para manejar usuarios, historial y favoritos.
- Integrar un módulo de IA que detecte etiquetas visuales de una imagen.
- Conectar el sistema con una API pública de anime para obtener resultados reales.
- Desplegar el proyecto en una plataforma web y documentar el proceso.

## 5. Tecnologías utilizadas
- React para la interfaz.
- Express y Node.js para el servidor.
- MongoDB Atlas para la persistencia.
- FastAPI con CLIP para el análisis de imagen.
- JWT para el control de acceso.
- AniList GraphQL para el catálogo de anime.

## 6. Arquitectura del sistema
El usuario interactúa con el front-end. La imagen se manda al back-end y este la reenvía al servicio de IA. La IA responde con etiquetas visuales que después se traducen a géneros y tags. Con esos filtros se consulta AniList y el sistema devuelve resultados relevantes. Finalmente, el historial y los favoritos se almacenan en la base de datos.

## 7. Funcionalidades principales
- Registro e inicio de sesión.
- Dashboard para subir imágenes.
- Detección de etiquetas por IA.
- Recomendaciones con datos reales de AniList.
- Guardado de favoritos.
- Consulta de historial.

## 8. Seguridad
Se utiliza JWT para proteger rutas privadas. Las contraseñas se almacenan con hash mediante bcryptjs. La base de datos es consumida solo por el back-end y no desde el navegador.

## 9. Resultados esperados
Se espera contar con una plataforma funcional que permita descubrir anime de forma distinta a las búsquedas tradicionales, usando visión por computadora y filtrado semántico.

## 10. Limitaciones
- El modelo no reconoce con certeza absoluta el anime exacto.
- La recomendación depende de etiquetas generales.
- El servicio de IA puede consumir más recursos al desplegarlo.

## 11. Conclusión
AnimeVision cumple con los requerimientos de un proyecto integral, ya que combina desarrollo web completo, autenticación, persistencia, API externa, inteligencia artificial y documentación técnica. Además, es un proyecto fácil de explicar en una exposición porque tiene una entrada clara, un proceso visible y una salida útil para el usuario.
