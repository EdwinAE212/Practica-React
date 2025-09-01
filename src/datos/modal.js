import React from "react";
import "./modal.css";

const Modal = ({ isOpen, onClose, personaje }) => {
    if (!isOpen || !personaje) return null;

    return (
        <div className="overlay">
            <div className="contenido">
                <button className="cerrar" onClick={onClose}> &times; </button>

                <div className="card">
                    <h2>{personaje.name}</h2>
                    <p><strong>Peliculas:</strong> {personaje.films?.join(", ") || "Dato Desconocido"}</p>
                    <p><strong>Vehículos:</strong> {personaje.vehicles?.join(", ") || "Dato Desconocido"}</p>
                    <p><strong>Naves:</strong> {personaje.starships?.join(", ") || "Dato Desconocido"}</p>
                </div>
            </div>
        </div>
    );
};

export default Modal;