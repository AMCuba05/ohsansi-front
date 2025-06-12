import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCR6DigitVerifier = ({ targetNumber = '408846', onFinalize }) => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState('');
    const [isMatch, setIsMatch] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [file, setFile] = useState(null);

    const handleImageChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setImage(URL.createObjectURL(selectedFile));
        setIsProcessing(true);

        try {
            const { data: { text } } = await Tesseract.recognize(selectedFile, 'eng', {
                tessedit_char_whitelist: '0123456789',
            });

            const digits = text.replace(/\D/g, '');
            setResult(digits);

            const isNumberFound = digits.includes(targetNumber);
            setIsMatch(isNumberFound);
        } catch (error) {
            setResult('Error al procesar la imagen');
            setIsMatch(false);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFinalize = () => {
        if (isMatch && file && onFinalize) {
            onFinalize({ isMatch, file, digits: result });
        }
    };

    return (
        <div className="container mt-3">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control mb-3"
            />
            {image && (
                <img src={image} alt="Uploaded" className="img-fluid mb-3" style={{ maxWidth: '300px' }} />
            )}
            {isProcessing ? (
                <p>Procesando...</p>
            ) : (
                <p>
                    Resultado:
                    {isMatch !== null && (
                        <span className={isMatch ? 'text-success' : 'text-danger'}>
              {isMatch ? ` (Se verifo la orden de pago: ${targetNumber})` : ` (No se pudo verificar la orden de pago: ${targetNumber})`}
            </span>
                    )}
                </p>
            )}
            <button
                className="btn btn-success"
                onClick={handleFinalize}
                disabled={!isMatch || isProcessing}
            >
                Finalizar Pago
            </button>
        </div>
    );
};

export default OCR6DigitVerifier;