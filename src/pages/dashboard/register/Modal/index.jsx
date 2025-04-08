import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import "./modal.scss"

const Modal = ({ success, children, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {success ? (
                    <CheckCircle color="green" size={40} />
                ) : (
                    <XCircle color="red" size={40} />
                )}
                <p>{children}</p>
                <button onClick={onClose} className="close-button">
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default Modal;