import React from 'react';

export default function ScaleInput({ index, label, value, onChange, min = 1, max = 5 }) {
    return (
        <div className="mb-6 w-full max-w-2xl">
            <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-stretch">
                {index + 1}. {label}
            </label>
            <input
                type="range"
                min={min}
                max={max}
                value={value || min}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full flex items-stretch"
            />
            <div className="text-lg text-gray-900 mt-1">Value: {value}</div>
        </div>
    );
}