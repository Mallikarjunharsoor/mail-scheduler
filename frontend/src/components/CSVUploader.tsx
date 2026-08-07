import { ChangeEvent, useState } from 'react';

interface CSVUploaderProps {
  onUpload: (rows: string[][]) => void;
}

export default function CSVUploader({ onUpload }: CSVUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0)
        .map((line) => line.split(',').map((cell) => cell.trim()));
      onUpload(rows);
    } catch {
      setError('Unable to read CSV file.');
    }
  };

  return (
    <div className="csv-uploader">
      <label className="csv-button">
        Upload CSV
        <input type="file" accept=".csv" onChange={handleFileChange} hidden />
      </label>
      {error && <div className="csv-error">{error}</div>}
    </div>
  );
}
