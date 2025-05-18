// components/Pages/Inscripciones.jsx
import React, { useState, useEffect } from "react";
import "./index.scss";
import {FirstStep} from "../register/RegisterSteps/FirstStep.jsx";
import SecondStep from "./RegisterMultipleStepsExcel/SecondStep.jsx"
import {Steps} from "react-step-builder";
import {ThirdStep} from "./RegisterMultipleStepsExcel/ThirdStep.jsx";
import {FouthStep} from "./RegisterMultipleStepsExcel/FouthStep.jsx";
import {FifthStep} from "./RegisterMultipleStepsExcel/FifthStep.jsx";
import {SixthStep} from "./RegisterMultipleStepsExcel/SixthStep.jsx";

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
                <div>
                    <ThirdStep/>
                </div>
                <div>
                    <FouthStep/>
                </div>
                <div>
                    <FifthStep/>
                </div>
                <div>
                    <SixthStep/>
                </div>
            </Steps>
        </div>
    );
};

export default Inscripciones;
