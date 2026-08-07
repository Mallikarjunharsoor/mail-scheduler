import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export default function CSVUploader({ onUpload }) {
    const [error, setError] = useState(null);
    const handleFileChange = async (event) => {
        setError(null);
        const file = event.target.files?.[0];
        if (!file)
            return;
        try {
            const text = await file.text();
            const rows = text
                .split(/\r?\n/)
                .filter((line) => line.trim().length > 0)
                .map((line) => line.split(',').map((cell) => cell.trim()));
            onUpload(rows);
        }
        catch {
            setError('Unable to read CSV file.');
        }
    };
    return (_jsxs("div", { className: "csv-uploader", children: [_jsxs("label", { className: "csv-button", children: ["Upload CSV", _jsx("input", { type: "file", accept: ".csv", onChange: handleFileChange, hidden: true })] }), error && _jsx("div", { className: "csv-error", children: error })] }));
}
