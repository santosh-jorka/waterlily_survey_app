import React, {useEffect, useState} from "react";
import yaml from 'js-yaml';
import TextInput from "./inputs/TextInput.jsx";
import SelectInput from "./inputs/SelectInput.jsx";
import ScaleInput from "./inputs/ScaleInput.jsx";
import CheckboxGroup from "./inputs/CheckboxGroup.jsx";
import BooleanToggle from "./inputs/BooleanToggle.jsx";


export default function SurveyForm(){
    const [yamlQuestions, setYamlQuestions] = useState('')
    const [dbQuestions, setDbQuestions] = useState([])
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({})

    useEffect(() => {
        fetch('/survey.yaml')
            .then(response => response.text())
            .then(data => {
                const parsedData = yaml.load(data);
                console.log('Parsed YAML data:', parsedData.questions);
                setYamlQuestions(parsedData.questions);
            })
            .catch(error => console.error('Error fetching YAML file:', error));

        fetch('http://localhost:3000/api/questions')
            .then(response => response.json())
            .then(data => {
                setDbQuestions(data);
            })
            .catch(error => console.error('Error fetching questions from DB:', error));
    }, []);

        const handleChange = (id,value) => {
            setFormData({...formData, [id]: value});
        }


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userId) {
            alert("User ID not found. Please check email.");
            return;
        }

        const answers = Object.entries(formData).map(([questionId, value]) => ({
            questionId: parseInt(questionId),
            value: String(value)
        }));

        try {
            const res = await fetch(`http://localhost:3000/api/responses/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers }),
            });

            const result = await res.json();
            if (!res.ok) {
                alert(result.error || "Submission failed.");
            } else {
                alert("Survey submitted successfully!");
            }

        } catch (error) {
            console.error("Error submitting form:", error);
            setEmail('');
            setUserId(null);
            setFormData({});
        }
    };

    const handleEmailBlur = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/users?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (res.ok) {
                setUserId(data.id);
            }else{
                alert(data.error || "User not found.");
                setUserId(null);
            }
        } catch (err) {
            console.error("Failed to fetch user ID:", err);
        }
    };
    const renderQuestion = (q, index)=>{
            switch (q.type) {
                case 'number':
                    return<TextInput key={q.id}
                                     label={q.label}
                                     index={index}
                                     value={formData[q.id] || ''}
                                     onChange={(val) => handleChange(q.id, val)} />;
                case 'single-choice':
                case 'multiple-choice': // treat same
                    return <SelectInput key={q.id}
                                        label={q.label}
                                        index={index}
                                        options={q.options}
                                        value={formData[q.id] || ''}
                                        onChange={(val) => handleChange(q.id, val)} />;
                case 'rating':
                    return <ScaleInput
                        key={q.id}
                        label={q.label}
                        index={index}
                        value={formData[q.id]}
                        onChange={(val) => handleChange(q.id, val)}
                    />;
                case 'yes-no':
                    return <BooleanToggle
                        key={q.id}
                        label={q.label}
                        index={index}
                        value={formData[q.id]}
                        onChange={(val) => handleChange(q.id, val)}
                    />;
                case 'checkbox':
                    return <CheckboxGroup
                        key={q.id}
                        label={q.label}
                        index={index}
                        options={q.options}
                        value={formData[q.id] || []}
                        onChange={(val) => handleChange(q.id, val)}
                    />;
                default:
                    return null;
            }
    }

    const canSubmit =
        userId &&
        yamlQuestions?.length &&
        yamlQuestions.every((q) => formData[q.id] !== undefined && formData[q.id] !== '');

    const handleReset = () => {
        setEmail('');
        setUserId(null);
        setFormData({});
    };

    return (
        <div className="min-h-screen w-full bg-white flex justify-center items-start py-12 px-4">
            <div className="w-full max-w-3xl">
                <h1 className="text-4xl font-bold mb-8 text-gray-600 text-center">Survey Form</h1>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Your Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}  // Fetch user ID when email is deselected
                    className="w-2/3 border border-black-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    required
                />

                <form onSubmit={handleSubmit}
                      className="w-full bg-white shadow-lg rounded-lg px-8 pt-6 pb-10">
                    {Array.isArray(yamlQuestions) && yamlQuestions.map((q, i) => renderQuestion(q, i))}

                        <button type="submit"
                                disabled={!canSubmit}
                                className={`mt-4 w-full text-white font-semibold py-3 px-6 rounded ${
                                    canSubmit
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Submit
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded"
                        >
                            New Survey Submission Reset
                        </button>

                        {!canSubmit && (
                            <p className="mt-2 text-sm text-red-600">
                                {!userId
                                    ? 'Please enter a valid email and click outside the field to retrieve your user ID.'
                                    : 'Please answer all questions before submitting.'}
                            </p>
                        )}

                </form>
            </div>
        </div>


)


}