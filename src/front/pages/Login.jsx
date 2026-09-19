import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, getServerMessage } from "../utils/auth";

export const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(getServerMessage(data, "No se pudo iniciar sesión."));
                return;
            }

            sessionStorage.setItem("token", data.token);
            navigate("/private");
        } catch {
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-7 col-lg-5">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h1 className="h3 mb-4"><i className="fa-solid fa-right-to-bracket me-2" />Iniciar sesión</h1>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <label className="form-label" htmlFor="login-email">Email</label>
                                <div className="input-group mb-3">
                                    <span className="input-group-text"><i className="fa-solid fa-envelope" /></span>
                                    <input id="login-email" className="form-control" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                                </div>
                                <label className="form-label" htmlFor="login-password">Contraseña</label>
                                <div className="input-group mb-4">
                                    <span className="input-group-text"><i className="fa-solid fa-lock" /></span>
                                    <input id="login-password" className="form-control" type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
                                </div>
                                <button className="btn btn-primary w-100" disabled={loading} type="submit">
                                    {loading ? "Ingresando..." : "Ingresar"}
                                </button>
                            </form>
                            <p className="text-center mt-4 mb-0">¿No tienes cuenta? <Link to="/signup">Regístrate</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
