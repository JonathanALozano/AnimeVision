import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setHistory(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            alert("No se pudo cargar el historial");
        } finally {
            setLoading(false);
        }
    };

    const deleteOne = async (id) => {
        const confirmed = confirm("¿Seguro que quieres eliminar este análisis?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");

            await fetch(`${API_URL}/api/history/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setHistory((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar");
        }
    };

    const clearHistory = async () => {
        const confirmed = confirm("¿Seguro que quieres vaciar todo el historial?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");

            await fetch(`${API_URL}/api/history`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setHistory([]);
        } catch (error) {
            console.error(error);
            alert("No se pudo vaciar el historial");
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <main className="page-shell">
            <section className="history-header card">
                <div>
                    <h2 className="section-title">Tu historial</h2>
                    <p className="section-subtitle">
                        Revisa tus análisis previos y elimina los que ya no quieras conservar.
                    </p>
                </div>

                <button className="btn btn-danger" onClick={clearHistory}>
                    Vaciar historial
                </button>
            </section>

            {loading ? (
                <section className="card">
                    <p className="muted-text">Cargando historial...</p>
                </section>
            ) : history.length === 0 ? (
                <section className="card empty-state">
                    <div className="empty-state__icon">🕘</div>
                    <h4>No tienes análisis guardados</h4>
                    <p>Cuando analices imágenes, aparecerán aquí.</p>
                </section>
            ) : (
                <section className="history-grid">
                    {history.map((item) => (
                        <article className="history-card" key={item._id}>
                            <div className="history-card__image-wrap">
                                <img src={item.imageUrl} alt="Historial" className="history-card__image" />
                            </div>

                            <div className="history-card__content">
                                <div className="history-card__top">
                                    <div>
                                        <h4 className="mini-title">Análisis guardado</h4>
                                        <p className="muted-text">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <button className="btn btn-outline-danger" onClick={() => deleteOne(item._id)}>
                                        Eliminar
                                    </button>
                                </div>

                                <div className="history-section">
                                    <p className="filters-line">
                                        <strong>Etiquetas:</strong>{" "}
                                        {item.detectedLabels?.length
                                            ? item.detectedLabels.map((x) => x.label).join(", ")
                                            : "Sin etiquetas"}
                                    </p>
                                </div>

                                <div className="history-section">
                                    <p className="filters-line">
                                        <strong>Top recomendaciones:</strong>{" "}
                                        {item.recommendations?.length
                                            ? item.recommendations.slice(0, 3).map((x) => x.title).join(", ")
                                            : "Sin recomendaciones"}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}