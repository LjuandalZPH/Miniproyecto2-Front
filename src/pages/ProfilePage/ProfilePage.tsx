import React from "react";
import "./ProfilePage.scss";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const handleEdit = () => {
    alert("Función de editar perfil aún no implementada");
  };

  const handleDelete = () => {
    const confirmDelete = confirm("¿Seguro que deseas borrar la cuenta?");
    if (confirmDelete) {
      alert("Cuenta eliminada");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Mi Cuenta</h2>
        <div className="profile-avatar">
          <img
            alt="avatar"
          />
        </div>

        <div className="profile-info">
          <p><strong>Nombre:</strong></p>
          <p><strong>Apellido:</strong></p>
          <p><strong>Edad:</strong></p>
          <p><strong>Correo:</strong></p>
        </div>

        <div className="profile-buttons">
          <button className="edit-btn" onClick={handleEdit}>✏️ Editar</button>
          <button className="delete-btn" onClick={handleDelete}>❌ Borrar Cuenta</button>
        </div>
      </div>

      <button className="home-btn" onClick={() => navigate("/")}>
        🏠 HOME
      </button>
    </div>
  );
};

export default ProfilePage;
