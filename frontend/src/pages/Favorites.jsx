import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/favorites`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setFavorites(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            alert("No se pudieron cargar los favoritos");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFavorite = async (favoriteId) => {
        const confirmed = confirm("¿Eliminar este anime de favoritos?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/favorites/${favoriteId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "No se pudo eliminar de favoritos");
            }

            setFavorites((prev) => prev.filter((item) => item._id !== favoriteId));
        } catch (error) {
            console.error(error);
            alert(error.message || "No se pudo eliminar de favoritos");
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <main className="page-shell">
            <section className="card page-header-card">
                <div>
                    <h2 className="section-title">Tus favoritos</h2>
                    <p className="section-subtitle">
                        Aquí aparecen los animes que guardaste desde las recomendaciones.
                    </p>
                </div>
            </section>

            {loading ? (
                <section className="card empty-state">
                    <div className="empty-state__icon">⭐</div>
                    <h4>Cargando favoritos...</h4>
                </section>
            ) : favorites.length === 0 ? (
                <section className="card empty-state">
                    <div className="empty-state__icon">💙</div>
                    <h4>Aún no tienes favoritos guardados</h4>
                    <p>Guarda recomendaciones para verlas aquí.</p>
                </section>
            ) : (
                <section className="recommendations-grid">
                    {favorites.map((anime) => (
                        <article className="anime-card" key={anime._id}>
                            <div className="anime-card__image-wrap">
                                <img
                                    src={anime.coverImage}
                                    alt={anime.title}
                                    className="anime-card__image"
                                />
                            </div>

                            <div className="anime-card__body">
                                <div className="anime-card__top">
                                    <h4 className="anime-card__title">{anime.title}</h4>
                                    <span className="score-badge">
                                        {anime.averageScore ? `${anime.averageScore}%` : "N/A"}
                                    </span>
                                </div>

                                <div className="chips-wrap">
                                    {(anime.genres || []).slice(0, 4).map((genre) => (
                                        <span className="chip chip-dark" key={genre}>
                                            {genre}
                                        </span>
                                    ))}
                                </div>

                                <div className="anime-card__actions">
                                    <button
                                        className="btn btn-danger-soft"
                                        onClick={() => handleDeleteFavorite(anime._id)}
                                    >
                                        Quitar de favoritos
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}