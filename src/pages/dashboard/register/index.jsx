// components/Pages/Inscripciones.jsx
import { useState } from 'react';
import { Steps } from 'react-step-builder';
import './index.scss';
import { FirstStep } from './RegisterSteps/FirstStep.jsx';
import { LastStep } from './RegisterSteps/LastStep.jsx';
import { NewFirstStep } from './RegisterSteps/NewFirstStep.jsx';
import { NewFourthStep } from './RegisterSteps/NewFourthStep.jsx';
import { NewSecondStep } from './RegisterSteps/NewSecondStep.jsx';
import { NewThirdStep } from './RegisterSteps/NewThirdStep.jsx';
import { RecoverSessionStep } from './RegisterSteps/RecoverSessionStep.jsx';

const Inscripciones = () => {
    const [boletaData, setBoletaData] = useState({});

    return (
        <div className="inscripciones-container">
            <Steps>
                <div>
                    <FirstStep />
                </div>
                <div>
                    <RecoverSessionStep />
                </div>
                <div>
                    <NewSecondStep />
                </div>
                <div>
                    <NewFirstStep />
                </div>

                <div>
                    <NewThirdStep />
                </div>
                <div>
                    <NewFourthStep setBoletaData={setBoletaData} />
                </div>
                <div>
                    <LastStep boletaData={boletaData} />
                </div>
            </Steps>
        </div>
    );
};

export default Inscripciones;
