import { Link } from "react-router-dom";

export default function Home() {
    const token = localStorage.getItem("token");

    return (
        <main className="page-shell home-page-clean">
            <section className="card home-clean-hero">
                <span className="pill pill-gradient">Proyecto completo con IA</span>

                <h1 className="home-clean-title">
                    Encuentra animes parecidos
                    <br />
                    a partir de una imagen
                </h1>

                <p className="home-clean-text">
                    Sube un póster, portada o screenshot y deja que la IA detecte el estilo visual
                    para recomendarte animes similares usando AniList, historial y favoritos por usuario.
                </p>

                <div className="home-clean-actions">
                    {token ? (
                        <>
                            <Link to="/dashboard" className="btn btn-primary">
                                Ir al dashboard
                            </Link>
                            <Link to="/history" className="btn btn-outline">
                                Ver historial
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="btn btn-primary">
                                Empezar ahora
                            </Link>
                            <Link to="/login" className="btn btn-outline">
                                Ya tengo cuenta
                            </Link>
                        </>
                    )}
                </div>
            </section>

            <section className="home-clean-grid">
                <article className="card home-clean-card">
                    <div className="home-clean-icon">🖼️</div>
                    <h3>Sube una imagen</h3>
                    <p>
                        Usa una portada, póster o screenshot del anime que te guste como referencia visual.
                    </p>
                </article>

                <article className="card home-clean-card">
                    <div className="home-clean-icon">🧠</div>
                    <h3>La IA analiza el estilo</h3>
                    <p>
                        El sistema detecta etiquetas, géneros y pistas visuales para construir mejores filtros.
                    </p>
                </article>

                <article className="card home-clean-card">
                    <div className="home-clean-icon">⭐</div>
                    <h3>Guarda favoritos e historial</h3>
                    <p>
                        Todo queda asociado a tu cuenta para revisar análisis anteriores cuando quieras.
                    </p>
                </article>
            </section>

            <section className="home-clean-grid home-clean-grid--small">
                <article className="card home-info-card">
                    <h3>Front-end</h3>
                    <p>React + Vite para una experiencia rápida, moderna y clara.</p>
                </article>

                <article className="card home-info-card">
                    <h3>Back-end</h3>
                    <p>Express maneja autenticación, favoritos, historial y conexión con MongoDB y AniList.</p>
                </article>

                <article className="card home-info-card">
                    <h3>IA</h3>
                    <p>FastAPI + CLIP interpretan la imagen y la convierten en filtros útiles.</p>
                </article>
            </section>
        </main>
    );
}