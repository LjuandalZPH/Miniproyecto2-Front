import React, { useEffect, useState } from "react";
import "./ProfilePage.scss";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { getProfile, updateUser } from "../../services/authService";
import { deleteUser } from "../../services/authService";

interface UserProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const u = data?.user ?? data;
        setUser({
          id: u._id ?? u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          age: u.age,
          email: u.email,
        });
      } catch (err: any) {
        console.error("Error al obtener perfil:", err);
        setError("No se pudo cargar la información del usuario. Por favor inicia sesión nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    if (!user) return;
    setEditedUser(user);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      const updated = await updateUser(user.id, editedUser);
      console.log("Respuesta del backend:", updated);

      if (updated?.user) {
        const u = updated.user;
        setUser({
          id: u._id ?? u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          age: u.age,
          email: u.email,
        });
      }

      setIsEditing(false);
      alert("Perfil actualizado correctamente ");
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      alert("Error al actualizar el perfil ");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
  const confirmDelete = confirm(" ¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
  if (!confirmDelete || !user?.id) return;

  try {
    await deleteUser(user.id);
    alert("Cuenta eliminada exitosamente ");
    localStorage.removeItem("token"); // cerrar sesión automáticamente
    navigate("/register");
  } catch (error) {
    console.error("Error al borrar cuenta:", error);
    alert("Error al eliminar la cuenta ");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Sesión cerrada correctamente ");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <p>Cargando perfil...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <p className="error">{error}</p>
          <button onClick={() => navigate("/login")} className="home-btn">
            Volver al login
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <button className="home-btn" onClick={() => navigate("/")}>
          Volver
        </button>

        <div className="profile-card">
          <h2>Mi Cuenta</h2>

          <div className="profile-avatar">
            <img src={`${import.meta.env.BASE_URL}MoovieNormal.png`} alt="avatar" />
          </div>

          {!isEditing ? (
            <>
              <div className="profile-info">
                <p>
                  <strong>Nombre:</strong> {user?.firstName ?? "—"}
                </p>
                <p>
                  <strong>Apellido:</strong> {user?.lastName ?? "—"}
                </p>
                <p>
                  <strong>Edad:</strong> {user?.age ?? "—"}
                </p>
                <p>
                  <strong>Correo:</strong> {user?.email ?? "—"}
                </p>
              </div>

              <div className="profile-buttons">
                <button className="edit-btn" onClick={handleEdit}>
                  Editar
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                  Borrar Cuenta
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <form className="profile-edit-form">
                <label>Nombre</label>
                <input
                  type="text"
                  value={editedUser.firstName ?? ""}
                  onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                />

                <label>Apellido</label>
                <input
                  type="text"
                  value={editedUser.lastName ?? ""}
                  onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                />

                <label>Edad</label>
                <input
                  type="number"
                  value={editedUser.age ?? ""}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, age: Number(e.target.value) })
                  }
                />
              </form>

              <div className="profile-buttons">
                <button className="save-btn" onClick={handleSave}>
                  Guardar
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
        
        
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;





