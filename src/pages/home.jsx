import { useState } from 'react';
import SkeletonModel from '../componenets/SkeletonModel.jsx';
import XrayUpload from '../componenets/XrayUpload';
import PatientForm from '../componenets/PatientForm';
import ResultsView from '../componenets/ResultView';
import bg from '../skeleton_bg.jpg';
import bgv from '../bg_v.mp4';
import { Link } from 'react-router-dom';
export default function Home() {
    const [patient, setPatient] = useState(null);
    const [xrayFile, setXrayFile] = useState(null);
    const [xrayPreview, setXrayPreview] = useState(null);
    const [arthritisResult, setArthritisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handlePatientSubmit = (patientData) => {
        setPatient(patientData);
    };

    const handleXrayUpload = (file) => {
        setXrayFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => setXrayPreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleAnalyzeClick = async () => {
        if (!xrayFile || !patient) return;

        setIsAnalyzing(true);

        try {
            // MOCKED result for testing/demo purposes
            const mockResult = {
                grade: 3, // Arthritis severity (0-4)
                confidence: 0.92
            };
            setArthritisResult(mockResult);

            // --- Real API logic (commented for now) ---
            /*
            const formData = new FormData();
            formData.append('xray', xrayFile);
            formData.append('age', patient.age);
            formData.append('sex', patient.sex);
            formData.append('weight', patient.weight);
        
            const response = await fetch('YOUR_ML_API_ENDPOINT', {
              method: 'POST',
              body: formData
            });
        
            const result = await response.json();
            setArthritisResult(result);
            */

            // --- Optional Gemini recommendation (commented) ---
            /*
            if (mockResult) {
              const geminiResponse = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  patient: patient,
                  arthritisGrade: mockResult.grade
                })
              });
        
              const recommendations = await geminiResponse.json();
              setArthritisResult(prev => ({
                ...prev,
                recommendations: recommendations.text
              }));
            }
            */
        } catch (error) {
            console.error("Error analyzing X-ray:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetApp = () => {
        setPatient(null);
        setXrayFile(null);
        setXrayPreview(null);
        setArthritisResult(null);
    };

    return (
        <div className="min-h-screen bg-black">
            <div className="w-screen h-screen relative z-2 overflow-hidden rounded-xl">
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    src={bgv}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                <div className="absolute inset-0 bg-white/2 backdrop-blur flex items-center justify-center flex-col"></div>
                <div className='z-20 flex flex-col fixed left-6 top-[45%] translate-y-[-50%] w-auto'>
                    <div className="relative group inline-block w-full">
                    <Link to='/comorbidity'>
                        <button className=" mb-2 p-4 w-full bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20">
                            <span className="relative z-10 flex items-center justify-start">
                                <svg className="w-5 h-5 mr-2 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8,8 L16,16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M16,8 L8,16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" fill="none" />
                                    <path d="M12,5 L12,7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M12,17 L12,19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M5,12 L7,12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M17,12 L19,12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                Drug Response
                            </span>
                        </button>
                    </Link>
                    <div className="absolute hidden group-hover:block bg-white text-sm text-gray-800 px-3 py-2 rounded shadow-md mt-2 z-10">
                        Drug Response Prediction for Osteoarthritis Patients
                    </div>
                </div>
                <div className="relative group inline-block w-full">
                    <button className="p-4 w-full bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20">
                        <span className="relative z-10 flex flex-row items-center justify-start">
                            <svg className="w-5 h-5 mr-2 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4,10 L8,6 M8,6 L12,10 M12,10 L16,6 M16,6 L20,10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M4,14 L8,18 M8,18 L12,14 M12,14 L16,18 M16,18 L20,14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none" />
                            </svg>
                            Comorbidity
                        </span>
                    </button>
                    <div className="absolute hidden group-hover:block bg-white text-sm text-gray-800 px-3 py-2 rounded shadow-md mt-2 z-10">
                        Comorbidity Prediction for Osteoarthritis Patients
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center w-full h-full'>
                <div className="p-6 z-11 flex items-center justify-center">
                    {!arthritisResult ? (
                        <>
                            <PatientForm onSubmit={handlePatientSubmit} patientData={patient} />

                            {patient && (
                                <XrayUpload
                                    onFileUpload={handleXrayUpload}
                                    preview={xrayPreview}
                                />
                            )}

                            {patient && xrayFile && (
                                <button
                                    onClick={handleAnalyzeClick}
                                    disabled={isAnalyzing}
                                    className="mt-6 z-11 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    {isAnalyzing ? 'Analyzing...' : 'Analyze X-ray'}
                                </button>
                            )}
                        </>
                    ) : (
                        <ResultsView
                            result={arthritisResult}
                            patient={patient}
                            xrayImage={xrayPreview}
                            onReset={resetApp}
                        />
                    )}
                </div>
            </div>
        </div>
        </div >
    );
}

