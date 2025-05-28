export default function TextInput({ index, label, value, onChange }) {
        return (
            <div className = "mb-6 w-full max-w-2xl">
                <label className="block  text-lg font-semibold text-gray-700 mb-2 flex items-stretch">
                    {index+1}. {label}
                </label>
                <input
                type = "number"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-half border border-black-300 rounded px-4 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-stretch"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                />
            </div>
        );
}