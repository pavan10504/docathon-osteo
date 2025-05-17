import { useState, useCallback } from 'react';
import SkeletonModel from '../componenets/SkeletonModel.jsx';
import XrayUpload from '../componenets/XrayUpload.jsx';
import PatientForm from '../componenets/PatientForm.jsx';
import ResultsView from '../componenets/ResultView.jsx';
import bg from '../skeleton_bg.jpg';
import bgv from '../bg_v.mp4';
import { Link } from 'react-router-dom';

export default function Osteo() {
    const [patient, setPatient] = useState(null);
    const [xrayFile, setXrayFile] = useState(null);
    const [xrayPreview, setXrayPreview] = useState(null);
    const [arthritisResult, setArthritisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);

    const handlePatientSubmit = (patientData) => {
        setPatient(patientData);
        setError(null);
    };

    const handleXrayUpload = (file) => {
        setXrayFile(file);
        setError(null);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => setXrayPreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleAnalyzeClick = async () => {
        if (!xrayFile || !patient) return;

        setIsAnalyzing(true);
        setUploadProgress(0);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', xrayFile);

            // Custom XMLHttpRequest to track upload progress
            const xhr = new XMLHttpRequest();

            // Set up progress tracking
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percentComplete);
                }
            });

            // Set up promise to handle response
            const xhrPromise = new Promise((resolve, reject) => {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            try {
                                const result = JSON.parse(xhr.responseText);
                                resolve(result);
                            } catch (e) {
                                reject(new Error('Invalid response format'));
                            }
                        } else {
                            reject(new Error(`Server returned status ${xhr.status}`));
                        }
                    }
                };
            });

            // Configure and send request
            xhr.open('POST', 'http://127.0.0.1:8000/predict', true);
            xhr.send(formData);

            // Wait for response
            const result = await xhrPromise;
            setArthritisResult(result);

        } catch (error) {
            console.error("Error analyzing X-ray:", error);
            setError(error.message || "Failed to analyze X-ray. Please try again.");
        } finally {
            setIsAnalyzing(false);
            setUploadProgress(0);
        }
    };

    const resetApp = useCallback(() => {
        setPatient(null);
        setXrayFile(null);
        setXrayPreview(null);
        setArthritisResult(null);
        setError(null);
    }, []);

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
                <div className='z-20 flex flex-col fixed left-6 top-[50%] translate-y-[-50%] w-auto'>
                    <div className="relative group inline-block w-full cursor-pointer">
                        <Link to='/response'>
                            <button className="p-4 w-full bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 cursor-pointer">
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
                    <Link to='/comorbidity'>
                        <div className="relative group inline-block w-full ">
                            <button className="p-4 w-full mt-4 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 cursor-pointer">
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
                    </Link>
                    <Link to='/chat'>
                        <div className="relative group inline-block w-full ">
                            <button className="p-4 w-full mt-4 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 cursor-pointer">
                                <span className="relative z-10 flex flex-row items-center justify-start">
                                    <svg className="w-5 h-5 mr-2 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7,8 a1,1 0 0,0 0,2 a1,1 0 0,0 0,-2" stroke="white" strokeWidth="1.5" />
                                        <path d="M17,8 a1,1 0 0,0 0,2 a1,1 0 0,0 0,-2" stroke="white" strokeWidth="1.5" />
                                        <path d="M12,16 C14,16 16,15 16,13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                        <rect x="4" y="4" width="16" height="16" rx="4" stroke="white" strokeWidth="1.5" fill="none" />
                                        <path d="M19,9 l3,-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M19,15 l3,3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M5,9 l-3,-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M5,15 l-3,3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    AI Chatbot
                                </span>
                            </button>
                            <div className="absolute hidden group-hover:block bg-white text-sm text-gray-800 px-3 py-2 rounded shadow-md mt-2 z-10">
                                Chatbot for Osteoarthritis Related stuff
                            </div>
                        </div>
                    </Link>

                </div>
                <div className='flex items-center justify-center w-full h-full overflow-auto'>
                    <div className="p-6 z-11 flex items-center justify-center flex-col">
                        {!arthritisResult ? (
                            <>
                                <PatientForm onSubmit={handlePatientSubmit} patientData={patient} />

                                {patient && (
                                    <XrayUpload
                                        onFileUpload={handleXrayUpload}
                                        preview={xrayPreview}
                                    />
                                )}

                                {error && (
                                    <div className="mt-2 w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                        <strong className="font-bold">Error:</strong>
                                        <span className="block sm:inline"> {error}</span>
                                    </div>
                                )}

                                {patient && xrayFile && (
                                    <button
                                        onClick={handleAnalyzeClick}
                                        disabled={isAnalyzing}
                                        className="mt-2 z-20 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-700"
                                    >
                                        {isAnalyzing ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {uploadProgress < 100 ? `Uploading (${uploadProgress}%)` : 'Analyzing...'}
                                            </div>
                                        ) : 'Analyze X-ray'}
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
        </div>
    );
}