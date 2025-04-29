// components/Pages/Inscripciones.jsx
import React, { useState, useEffect } from "react";
import "./index.scss";
import {FirstStep} from "../register/RegisterSteps/FirstStep.jsx";
import SecondStep from "./RegisterMultipleStepsExcel/SecondStep.jsx"
import {Steps} from "react-step-builder";

const Inscripciones = () => {

    return (
        <div className="inscripciones-container">
            <Steps>
                <div>
                    <FirstStep/>
                </div>
                <div>
                    <SecondStep/>
                </div>
            </Steps>
        </div>
    );
};

export default Inscripciones;
