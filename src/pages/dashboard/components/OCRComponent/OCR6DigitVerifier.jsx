import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCR6DigitVerifier = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState('');
    const [isValid, setIsValid] = useState(null);
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

            const isValidNumber = /^\d{6}$/.test(digits);
            setIsValid(isValidNumber);
        } catch (error) {
            setResult('Error processing image');
            setIsValid(false);
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
                <p>Processing...</p>
            ) : (
                <p>
                    Result: {result || 'No result yet'}
                    {isValid !== null && (
                        <span className={isValid ? 'text-success' : 'text-danger'}>
              {isValid ? ' (Valid 6-digit number)' : ' (Invalid, must be 6 digits)'}
            </span>
                    )}
                </p>
            )}
        </div>
    );
};

export default OCR6DigitVerifier;
