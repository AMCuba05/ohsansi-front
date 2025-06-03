// components/Pages/Inscripciones.jsx
import React, { useState, useEffect } from "react";

import "./index.scss";
import {FirstStep} from "../register/RegisterSteps/FirstStep.jsx";

import {Steps} from "react-step-builder";
import SecondStep from "./RegisterMultipleSteps/SecondStep.jsx";

const Inscripciones = () => {

    return (
        <div className="inscripciones-container">
            <Steps>
                <div>
                    <SecondStep/>
                </div>
                <div>
                    <FirstStep/>
                </div>
            </Steps>
        </div>
    );
};

export default Inscripciones;
