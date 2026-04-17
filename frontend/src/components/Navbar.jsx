import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const hideNavbar = ["/login", "/register"].includes(location.pathname);

    if (hideNavbar) return null;

    return (
        <header className="app-header">
            <div className="app-header__inner">
                <Link to="/" className="brand">
                    <div className="brand__logo">A</div>
                    <div>
                        <h1 className="brand__title">AnimeVision</h1>
                        <p className="brand__subtitle">Recomendador anime con IA</p>
                    </div>
                </Link>

                <nav className="nav-links">
                    <Link className={isActive("/") ? "nav-link active" : "nav-link"} to="/">
                        Inicio
                    </Link>

                    {token && (
                        <>
                            <Link
                                className={isActive("/dashboard") ? "nav-link active" : "nav-link"}
                                to="/dashboard"
                            >
                                Dashboard
                            </Link>
                            <Link
                                className={isActive("/favorites") ? "nav-link active" : "nav-link"}
                                to="/favorites"
                            >
                                Favoritos
                            </Link>
                            <Link
                                className={isActive("/history") ? "nav-link active" : "nav-link"}
                                to="/history"
                            >
                                Historial
                            </Link>
                        </>
                    )}
                </nav>

                <div className="header-user">
                    {token ? (
                        <>
                            <div className="header-user__badge">
                                Hola, {user?.name || "Usuario"}
                            </div>
                            <button className="btn btn-outline" onClick={handleLogout}>
                                Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="btn btn-outline" to="/login">
                                Iniciar sesión
                            </Link>
                            <Link className="btn btn-primary" to="/register">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}