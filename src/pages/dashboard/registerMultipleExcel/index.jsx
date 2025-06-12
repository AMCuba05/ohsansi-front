// components/Pages/Inscripciones.jsx
import React from "react";
import "./index.scss";
import {FirstStep} from "./RegisterMultipleStepsExcel/FirstStep.jsx";
import {SecondStep} from "./RegisterMultipleStepsExcel/SecondStep.jsx"
import {Steps} from "react-step-builder";
import {ThirdStep} from "./RegisterMultipleStepsExcel/ThirdStep.jsx";

import {RecoverSessionStep} from "./RegisterMultipleStepsExcel/RecoverSessionStep.jsx";
import {LastStep} from "./RegisterMultipleStepsExcel/LastStep.jsx";

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
                    <LastStep/>
                </div>
            </Steps>
        </div>
    );
};

export default Inscripciones;
