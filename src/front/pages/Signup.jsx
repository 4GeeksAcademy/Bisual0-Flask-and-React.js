import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, getServerMessage } from "../utils/auth";

export const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch(`${API_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(getServerMessage(data, "No se pudo crear la cuenta."));
                return;
            }

            setMessage(getServerMessage(data, "Cuenta creada correctamente."));
            setTimeout(() => navigate("/login"), 800);
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
                            <h1 className="h3 mb-4"><i className="fa-solid fa-user-plus me-2" />Crear cuenta</h1>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {message && <div className="alert alert-success">{message}</div>}
                            <form onSubmit={handleSubmit}>
                                <label className="form-label" htmlFor="signup-email">Email</label>
                                <div className="input-group mb-3">
                                    <span className="input-group-text"><i className="fa-solid fa-envelope" /></span>
                                    <input id="signup-email" className="form-control" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                                </div>
                                <label className="form-label" htmlFor="signup-password">Contraseña</label>
                                <div className="input-group mb-4">
                                    <span className="input-group-text"><i className="fa-solid fa-lock" /></span>
                                    <input id="signup-password" className="form-control" type="password" minLength="6" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
                                </div>
                                <button className="btn btn-primary w-100" disabled={loading} type="submit">
                                    {loading ? "Creando cuenta..." : "Registrarme"}
                                </button>
                            </form>
                            <p className="text-center mt-4 mb-0">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
