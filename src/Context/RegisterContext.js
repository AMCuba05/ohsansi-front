import { createContext, useContext } from 'react';

export const initialRegisterData = {
    olympic_id: null,
    olympic_name: '',
    olympic_price: '',
    identity: {
        ci: '',
        birthdate: '',
        olympicId: '',
    },
    olympiad: {
        id: '',
        price: '',
    },
    inscription_id: null,
    legal_tutor: {
        ci: null,
        ci_expedition: '',
        names: '',
        last_names: '',
        birthdate: '',
        email: '',
        phone_number: '',
        gender: '',
    },
    responsable: {
        ci: null,
        ci_expedition: '',
        names: '',
        last_names: '',
        birthdate: '',
        email: '',
        phone_number: '',
        gender: '',
    },
    competitor: {
        ci: null,
        ci_expedition: '',
        names: '',
        last_names: '',
        birthdate: '',
        email: '',
        phone_number: '',
        gender: '',
        school_data: {
            name: '',
            department: '',
            province: '',
            course: '',
        },
        selected_areas: [
            {
                area_id: null,
                category_id: null,
                academic_tutor: {
                    ci: null,
                    ci_expedition: '',
                    names: '',
                    last_names: '',
                    birthdate: '',
                    email: '',
                    phone_number: '',
                },
            },
        ],
    },
    boleta: null,
};

// Crear el contexto
export const RegisterContext = createContext();

// Hook para acceder al contexto fácilmente
export const useRegisterContext = () => {
    return useContext(RegisterContext);
};
