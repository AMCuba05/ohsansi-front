import React, { createContext, useContext, useState } from 'react';

const initialRegisterData = {
    olympic_id: null,
    olympic_name: "",
    olympic_price: "",
    identity: {
        ci: "",
        birthdate: "",
        olympicId: ""
    },
    olympiad: {
        id: "",
        price: ""
    },
    inscription_id: null,
    legal_tutor: {
        ci: null,
        ci_expedition: "",
        names: "",
        last_names: "",
        birthdate: "",
        email: "",
        phone_number: ""
    },
    responsable: {
        ci: null,
        ci_expedition: "",
        names: "",
        last_names: "",
        birthdate: "",
        email: "",
        phone_number: ""
    },
    competitor: {
        ci: null,
        ci_expedition: "",
        names: "",
        last_names: "",
        birthdate: "",
        email: "",
        gender: "",
        phone_number: "",
        school_data: {
            name: "",
            department: "",
            province: "",
            course: ""
        },
        selected_areas: [
            {
                area_id: null,
                category_id: null,
                academic_tutor: {
                    ci: null,
                    ci_expedition: "",
                    names: "",
                    last_names: "",
                    birthdate: "",
                    email: "",
                    phone_number: ""
                }
            }
        ]
    }
};

// Crear el contexto
const RegisterContext = createContext();

// Crear el proveedor del contexto
export const RegisterProvider = ({ children }) => {
    const [registerData, setRegisterData] = useState(initialRegisterData);

    return (
        <RegisterContext.Provider value={{ registerData, setRegisterData }}>
            {children}
        </RegisterContext.Provider>
    );
};

// Hook para acceder al contexto fácilmente
export const useRegisterContext = () => {
    return useContext(RegisterContext);
};
