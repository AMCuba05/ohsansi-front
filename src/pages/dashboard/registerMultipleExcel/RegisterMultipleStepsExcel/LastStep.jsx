import { ProgressBar } from 'react-bootstrap';
import { useSteps } from 'react-step-builder';

export const LastStep = () => {
    const stepsState = useSteps();

    return (
        <div className="container d-flex justify-content-center">
            <div className="card p-4">
                <span>
                    Paso {stepsState.current} de {stepsState.total}
                </span>
                <ProgressBar
                    now={stepsState.progress * 100}
                    label={`${Math.round(stepsState.progress * 100)}%`}
                    animated
                    striped
                    variant="success"
                    style={{ height: '1.5rem', fontSize: '0.9rem' }}
                />
                <h2 className="mb-3 mt-4">
                    Paso {stepsState.current}: Ya puedes descargar la boleta de
                    pago
                </h2>
                <p className="text-muted mb-4">
                    Presenta esta boleta de pagos en las cajas facultativas de
                    la universidad, siempre puedes regresar a est pantalla con
                    los datos del responsable del pago
                </p>
                <div className="mt-3">
                    <a href="/dashboard/payments">
                        Para descargar la boleta haz clic aquí
                    </a>
                    {/* <PDFDownloadLink
                        document={<PaymentReceipt data={boletaData} />}
                        fileName="boleta_pago.pdf"
                        onclick={() => generarBoleta}
                    >
                        {({ loading }) =>
                            loading
                                ? 'Generando PDF...'
                                : 'Descargar Boleta de pago'
                        }
                    </PDFDownloadLink> */}
                </div>
            </div>
        </div>
    );
};
