// components/Pages/Inscripciones.jsx
import React, { useState, useEffect } from "react";

import "./index.scss";
import {Steps} from "react-step-builder";
import {FirstStep} from "./RegisterMultipleSteps/FirstStep.jsx";
import {SecondStep} from "./RegisterMultipleSteps/SecondStep.jsx";
import {RecoverSessionStep} from "./RegisterMultipleSteps/RecoverSessionStep.jsx";
import {ThirdStep} from "./RegisterMultipleSteps/ThirdStep.jsx";

const Inscripciones = () => {

    return (
        <div className="inscripciones-container">
            <Steps>
                <div>
                    <FirstStep/>
                </div>
                <div>
                    <RecoverSessionStep/>
                </div>
                <div>
                    <SecondStep/>
                </div>
                <div>
                    <ThirdStep/>
                </div>
                <div>
                    <FirstStep/>
                </div>
            </Steps>
        </div>
    );
};

export default Inscripciones;
