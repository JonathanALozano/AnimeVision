import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(form.email, form.password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "No se pudo iniciar sesión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-box">
                <div className="auth-box__brand">
                    <div className="brand__logo">A</div>
                    <div>
                        <h1 className="brand__title">AnimeVision</h1>
                        <p className="brand__subtitle">Recomendador anime con IA</p>
                    </div>
                </div>

                <div className="auth-box__header">
                    <h2>Iniciar sesión</h2>
                    <p>
                        Entra a tu cuenta para ver recomendaciones, favoritos e historial.
                    </p>
                </div>

                <form className="auth-box__form" onSubmit={handleSubmit}>
                    <div className="auth-box__field">
                        <label htmlFor="email">Correo</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="tucorreo@email.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="auth-box__field">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Tu contraseña"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p className="auth-box__footer">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </section>
        </main>
    );
}