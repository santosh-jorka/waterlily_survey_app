import React from 'react';

export default function BooleanToggle({ index, label, value, onChange }) {
    return (
        <div className="mb-6 w-full max-w-2xl">
            <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-stretch">
                {index + 1}. {label}
            </label>
            <div className="flex gap-6">
                <label className="inline-flex text-gray-700 items-center flex items-stretch">
                    <input
                        type="radio"
                        name={label}
                        checked={value === true}
                        onChange={() => onChange(true)}
                        className="accent-blue-600"
                    />
                    <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex text-gray-700 items-center flex items-stretch">
                    <input
                        type="radio"
                        name={label}
                        checked={value === false}
                        onChange={() => onChange(false)}
                        className="accent-blue-600"
                    />
                    <span className="ml-2">No</span>
                </label>
            </div>
        </div>
    );
}