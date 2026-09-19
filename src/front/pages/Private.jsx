import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL, getServerMessage, getToken, logout } from "../utils/auth";

export const Private = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = getToken();

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`${API_URL}/api/private`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(getServerMessage(data, "Sesión no válida."));
                setUser(data.user);
            })
            .catch(() => {
                logout();
                navigate("/login", { replace: true });
            })
            .finally(() => setLoading(false));
    }, [navigate, token]);

    if (!token) return <Navigate to="/login" replace />;
    if (loading) return <main className="container py-5 text-center">Validando sesión...</main>;

    return (
        <main className="container py-5">
            <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: "620px" }}>
                <div className="card-body p-4 text-center">
                    <i className="fa-solid fa-shield-halved text-success fs-1 mb-3" />
                    <h1 className="h3">Área privada</h1>
                    <p className="mb-0">Sesión iniciada como <strong>{user?.email}</strong>.</p>
                </div>
            </div>
        </main>
    );
};
