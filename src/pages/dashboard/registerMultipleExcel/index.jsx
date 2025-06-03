// components/Pages/Inscripciones.jsx
import React from "react";
import "./index.scss";
import {FirstStep} from "./RegisterMultipleStepsExcel/FirstStep.jsx";
import {SecondStep} from "./RegisterMultipleStepsExcel/SecondStep.jsx"
import {Steps} from "react-step-builder";
import {ThirdStep} from "./RegisterMultipleStepsExcel/ThirdStep.jsx";
import {FouthStep} from "./RegisterMultipleStepsExcel/FouthStep.jsx";
import {RecoverSessionStep} from "../register/RegisterSteps/RecoverSessionStep.jsx";

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
                    <FouthStep/>
                </div>
            </Steps>
        </div>
    );
};

export default Inscripciones;
