import { useState } from 'react';
import {
    initialRegisterData,
    RegisterContext,
} from '../Context/RegisterContext';

export const RegisterProvider = ({ children }) => {
    const [registerData, setRegisterData] = useState(initialRegisterData);

    return (
        <RegisterContext.Provider value={{ registerData, setRegisterData }}>
            {children}
        </RegisterContext.Provider>
    );
};
