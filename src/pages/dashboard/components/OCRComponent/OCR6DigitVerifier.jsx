import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCR6DigitVerifier = ({ targetNumber = '408846' }) => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState('');
    const [isMatch, setIsMatch] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(URL.createObjectURL(file));
        setIsProcessing(true);

        try {
            const { data: { text } } = await Tesseract.recognize(file, 'eng', {
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
                    Resultado: {result || 'No hay resultados aún'}
                    {isMatch !== null && (
                        <span className={isMatch ? 'text-success' : 'text-danger'}>
              {isMatch ? ` (Se encontro ${targetNumber})` : ` (No se encontró ${targetNumber})`}
            </span>
                    )}
                </p>
            )}
        </div>
    );
};

export default OCR6DigitVerifier;
