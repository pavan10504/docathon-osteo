import { useState } from 'react';
import SkeletonModel from './componenets/SkeletonModel';
import XrayUpload from './componenets/XrayUpload';
import PatientForm from './componenets/PatientForm';
import ResultsView from './componenets/ResultView';
import bg  from '../src/skeleton_bg.jpg';
export default function App() {
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
    <div className="flex flex-col min-h-screen bg-black">
      <div
                className="w-screen h-screen z-2 bg-no-repeat rounded-xl bg-cover bg-center flex items-center justify-center"
                style={{ background: `url(${bg})` }}>
      <div className="absolute inset-0 bg-white/2 backdrop-blur flex items-center justify-center"></div>
      <main className="flex flex-1 flex-col md:flex-row">
        {/* Left side - 3D Model */}
        <div className="w-full md:w-1/2 h-96 md:h-auto z-10 ">
          {/*<SkeletonModel arthritisGrade={arthritisResult?.grade} />*/}
        </div>
        
        {/* Right side - Form & Results */}
        <div className="w-full md:w-1/2 p-6">
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
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
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
      </main>
      </div>
    </div>
  );
}

