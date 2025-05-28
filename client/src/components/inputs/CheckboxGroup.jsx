import React from 'react';

export default function CheckboxGroup({ index, label, options, value, onChange }) {
    const toggleOption = (opt) => {
        if (value.includes(opt)) {
            onChange(value.filter((v) => v !== opt));
        } else {
            onChange([...value, opt]);
        }
    };

    return (
        <div className="mb-6 w-full max-w-2xl">
            <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-stretch">
                {index + 1}. {label}
            </label>
            <div className="space-y-2">
                {options.map((opt, idx) => (
                    <div key={idx} className="flex item-center space-x-2">
                        <input
                            type="checkbox"
                            checked={value.includes(opt)}
                            onChange={() => toggleOption(opt)}
                            className="accent-blue-600"
                        />
                        <span className="text-gray-800">{opt}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
