// components/Pages/Inscripciones.jsx
import React, { useState, useEffect } from "react";

import "./index.scss";
import {Steps} from "react-step-builder";
import {FirstStep} from "./RegisterMultipleSteps/FirstStep.jsx";
import {SecondStep} from "./RegisterMultipleSteps/SecondStep.jsx";
import {RecoverSessionStep} from "./RegisterMultipleSteps/RecoverSessionStep.jsx";
import {ThirdStep} from "./RegisterMultipleSteps/ThirdStep.jsx";
import {NewFourthStep} from "./RegisterMultipleSteps/NewFourthStep.jsx";
import {LastStep} from "./RegisterMultipleSteps/LastStep.jsx";

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
                    <NewFourthStep/>
                </div>
                <div>
                    <LastStep/>
                </div>
            </Steps>
        </div>
    );
};

export default Inscripciones;
