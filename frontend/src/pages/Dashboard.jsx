import { useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Dashboard() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [savedIds, setSavedIds] = useState([]);

    const topRecommendations = useMemo(() => {
        return result?.recommendations || [];
    }, [result]);

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        setResult(null);
    };

    const handleAnalyze = async () => {
        if (!file) return;

        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch(`${API_URL}/api/recommendations`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo analizar la imagen");
            }

            setResult(data);
        } catch (error) {
            console.error(error);
            alert(error.message || "Ocurrió un error al analizar la imagen");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveFavorite = async (anime) => {
        try {
            const token = localStorage.getItem("token");

            const payload = {
                anilistId: anime.id,
                title:
                    anime.displayTitle ||
                    anime.title?.english ||
                    anime.title?.romaji ||
                    anime.title?.native ||
                    "Sin título",
                coverImage: anime.coverImage?.extraLarge || anime.coverImage?.large || "",
                genres: anime.genres || [],
                averageScore: anime.averageScore || null,
            };

            const response = await fetch(`${API_URL}/api/favorites`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || "No se pudo guardar en favoritos");
            }

            setSavedIds((prev) => [...prev, anime.id]);
        } catch (error) {
            console.error(error);
            alert(error.message || "No se pudo guardar en favoritos");
        }
    };

    return (
        <main className="page-shell">
            <section className="hero-card">
                <div className="hero-card__content">
                    <span className="pill pill-gradient">IA + Anime + Recomendaciones</span>
                    <h2 className="hero-title">
                        Descubre animes parecidos a partir de una sola imagen
                    </h2>
                    <p className="hero-text">
                        Sube un póster, screenshot o ilustración. El sistema analiza el estilo,
                        detecta etiquetas visuales y busca recomendaciones similares.
                    </p>
                </div>
            </section>

            <section className="dashboard-grid">
                <div className="card upload-card">
                    <div className="section-title-row">
                        <div>
                            <h3 className="section-title">Analizar imagen</h3>
                            <p className="section-subtitle">
                                Sube una imagen y obtén recomendaciones personalizadas
                            </p>
                        </div>
                    </div>

                    <label className="upload-dropzone">
                        <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                        <div className="upload-dropzone__icon">🖼️</div>
                        <h4>Selecciona una imagen</h4>
                        <p>PNG, JPG o WEBP</p>
                    </label>

                    <button className="btn btn-primary btn-full" onClick={handleAnalyze} disabled={!file || loading}>
                        {loading ? "Analizando..." : "Analizar imagen"}
                    </button>

                    {preview && (
                        <div className="preview-box">
                            <div className="section-title-row">
                                <h4 className="mini-title">Vista previa: {file?.name}</h4>
                            </div>
                            <div className="preview-image-wrapper">
                                <img src={preview} alt="Vista previa" className="preview-image" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="card insights-card">
                    <div className="section-title-row">
                        <div>
                            <h3 className="section-title">Resumen del análisis</h3>
                            <p className="section-subtitle">Etiquetas, filtros y estilo detectado</p>
                        </div>
                    </div>

                    <div className="insight-block">
                        <h4 className="mini-title">Etiquetas detectadas</h4>
                        <div className="chips-wrap">
                            {result?.detectedLabels?.length ? (
                                result.detectedLabels.map((item, index) => (
                                    <span className="chip chip-blue" key={index}>
                                        {item.label} ({Math.round(item.score * 100)}%)
                                    </span>
                                ))
                            ) : (
                                <p className="muted-text">Todavía no hay etiquetas detectadas.</p>
                            )}
                        </div>
                    </div>

                    <div className="insight-block">
                        <h4 className="mini-title">Filtros utilizados</h4>
                        <p className="filters-line">
                            <strong>Géneros:</strong>{" "}
                            {result?.filters?.genres?.length ? result.filters.genres.join(", ") : "Sin géneros detectados"}
                        </p>
                        <p className="filters-line">
                            <strong>Tags:</strong>{" "}
                            {result?.filters?.tags?.length ? result.filters.tags.join(", ") : "Sin tags detectados"}
                        </p>
                        {result?.visualStyle && (
                            <p className="filters-line">
                                <strong>Estilo visual:</strong> {result.visualStyle}
                            </p>
                        )}
                    </div>

                    <div className="insight-block">
                        <h4 className="mini-title">Consejo</h4>
                        <p className="muted-text">
                            Para mejores resultados usa pósters claros, imágenes completas y portadas donde se vea
                            bien el estilo general del anime.
                        </p>
                    </div>
                </div>
            </section>

            <section className="card recommendations-card">
                <div className="section-title-row">
                    <div>
                        <h3 className="section-title">Recomendaciones</h3>
                        <p className="section-subtitle">Resultados más cercanos según la IA y AniList</p>
                    </div>
                </div>

                <div className="recommendations-grid">
                    {topRecommendations.length ? (
                        topRecommendations.map((anime) => (
                            <article className="anime-card" key={anime.id}>
                                <div className="anime-card__image-wrap">
                                    <img
                                        src={anime.coverImage?.extraLarge || anime.coverImage?.large}
                                        alt={anime.displayTitle || anime.title?.english || anime.title?.romaji}
                                        className="anime-card__image"
                                    />
                                </div>

                                <div className="anime-card__body">
                                    <div className="anime-card__top">
                                        <h4 className="anime-card__title">
                                            {anime.displayTitle || anime.title?.english || anime.title?.romaji}
                                        </h4>
                                        <span className="score-badge">
                                            {anime.averageScore ? `${anime.averageScore}%` : "N/A"}
                                        </span>
                                    </div>

                                    <p className="anime-card__meta">
                                        {anime.seasonYear || "Año desconocido"} · {anime.format || "Anime"}
                                    </p>

                                    <div className="chips-wrap">
                                        {(anime.genres || []).slice(0, 4).map((genre) => (
                                            <span className="chip chip-dark" key={genre}>
                                                {genre}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="anime-card__description">
                                        {anime.description
                                            ? anime.description.replace(/<[^>]+>/g, "").slice(0, 170) + "..."
                                            : "Sin descripción disponible."}
                                    </p>

                                    <div className="anime-card__actions">
                                        <button
                                            className={`btn btn-favorite ${savedIds.includes(anime.id) ? "btn-favorite--saved" : ""}`}
                                            onClick={() => handleSaveFavorite(anime)}
                                            disabled={savedIds.includes(anime.id)}
                                        >
                                            {savedIds.includes(anime.id) ? "Guardado" : "Guardar en favoritos"}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state__icon">✨</div>
                            <h4>Aún no hay recomendaciones</h4>
                            <p>Sube una imagen para comenzar el análisis.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}