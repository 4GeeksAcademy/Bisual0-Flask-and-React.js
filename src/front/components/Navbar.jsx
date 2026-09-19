import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken, logout } from "../utils/auth";

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const authenticated = Boolean(getToken());

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-light bg-light border-bottom">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    <i className="fa-solid fa-layer-group me-2" />React App
                </Link>
                <div className="d-flex align-items-center gap-2">
                    {authenticated ? (
                        <>
                            <Link className={`btn btn-sm ${location.pathname === "/private" ? "btn-primary" : "btn-outline-primary"}`} to="/private">
                                <i className="fa-solid fa-lock me-1" />Privado
                            </Link>
                            <button className="btn btn-sm btn-outline-danger" onClick={handleLogout} type="button">
                                <i className="fa-solid fa-right-from-bracket me-1" />Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="btn btn-sm btn-outline-primary" to="/login">Ingresar</Link>
                            <Link className="btn btn-sm btn-primary" to="/signup">Registrarme</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};