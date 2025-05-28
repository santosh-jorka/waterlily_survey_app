export default function SelectInput({ index, label, options, value, onChange }) {
    return (
        <div className="mb-6 w-full">
            <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-stretch">
                {index + 1}. {label}
            </label>
            <select
                className="w-2/3 max-w-md border border-gray-300 rounded px-4 py-2 bg-white text-black flex items-stretch"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Select</option>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    )
}