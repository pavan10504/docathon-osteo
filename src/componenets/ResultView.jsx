import React, { useState } from 'react';

export default function ResultsView({ result, patient, xrayImage, onReset }) {
  const [viewMode, setViewMode] = useState('original'); // 'original' or 'gradcam'
  
  // Full descriptions for each grade
  const gradeDescriptions = {
    0: "No arthritis detected. The joint appears healthy.",
    1: "Mild arthritis. Minor joint space narrowing or small osteophytes.",
    2: "Moderate arthritis. Definite osteophytes and possible joint space narrowing.",
    3: "Severe arthritis. Multiple osteophytes, definite joint space narrowing, sclerosis and possible bone deformity.",
    4: "Extreme arthritis. Large osteophytes, marked joint space narrowing, severe sclerosis and definite bone deformity."
  };
  
  // Color schemes for different grades
  const gradeColors = {
    0: "bg-green-100 text-green-800",
    1: "bg-yellow-100 text-yellow-800",
    2: "bg-orange-100 text-orange-800",
    3: "bg-red-100 text-red-800",
    4: "bg-red-600 text-white"
  };
  
  // Format probabilities data for chart display
  const formatProbabilityData = () => {
    if (!result.probabilities) return [];
    
    return Object.entries(result.probabilities).map(([label, prob]) => ({
      grade: label.split(':')[0].trim(),
      probability: Math.round(prob * 100)
    }));
  };
  
  // Render confidence bar
  const renderConfidence = (confidence) => {
    const percent = Math.round(confidence * 100);
    return (
      <div className="mt-2">
        <div className="text-sm text-white mb-1">Confidence: {percent}%</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  // Render probability bars for all classes
  /*const renderProbabilityBars = () => {
    if (!result.probabilities) return null;
    
    return (
      <div className="mt-4">
        <h3 className="font-medium mb-2">Probability Distribution</h3>
        <div className="space-y-2">
          {Object.entries(result.probabilities).map(([label, prob]) => {
            const percent = Math.round(prob * 100);
            const grade = parseInt(label.charAt(5));
            return (
              <div key={label} className="flex items-center">
                <span className="text-sm text-white w-24">{label}</span>
                <div className="flex-grow">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${grade === result.grade ? 'bg-blue-600' : 'bg-gray-400'}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-white ml-2 w-10 text-right">{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };*/
  
  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md h-[80%] w-[70%] flex flex-col">
      <div className="flex justify-between items-center mb-6 text-white">
        <h2 className="text-xl font-semibold">X-ray Analysis Results</h2>
        <button
          onClick={onReset}
          className="text-blue-400 hover:text-blue-300 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Analysis
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 text-white h-full overflow-auto">
        <div className="md:w-1/3">
          {xrayImage && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">X-ray Image</h3>
              
              <div className="mb-2 flex space-x-2">
                <button 
                  onClick={() => setViewMode('original')}
                  className={`px-2 py-1 text-xs rounded-md ${viewMode === 'original' ? 'bg-blue-600' : 'bg-gray-600'}`}
                >
                  Original
                </button>
                {result.gradcam && (
                  <button 
                    onClick={() => setViewMode('gradcam')}
                    className={`px-2 py-1 text-xs rounded-md ${viewMode === 'gradcam' ? 'bg-blue-600' : 'bg-gray-600'}`}
                  >
                    GradCAM View
                  </button>
                )}
              </div>
              <div className='w-full'>
              <img 
                src={viewMode === 'original' ? xrayImage : (result.gradcam || xrayImage)} 
                alt={viewMode === 'original' ? "X-ray" : "X-ray with GradCAM overlay"}
                className="w-full h-[10%] object-contain rounded-xl border border-gray-600"
              />
              </div>
              
              {viewMode === 'gradcam' && (
                <div className="mt-2 text-xs text-gray-300">
                  <p>GradCAM highlights regions that most influenced the model's prediction. Red areas indicate highest activation.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Patient Information</h3>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-300">Name:</div>
                <div>{patient.name || 'Anonymous'}</div>
                <div className="text-gray-300">Age:</div>
                <div>{patient.age} years</div>
                <div className="text-gray-300">Sex:</div>
                <div>{patient.sex}</div>
                <div className="text-gray-300">Weight:</div>
                <div>{patient.weight} kg</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Arthritis Grade</h3>
            <div className="flex items-center mb-2">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${gradeColors[result.grade]}`}>
                {result.label || `Grade ${result.grade}`}
              </div>
            </div>
            {result.confidence && renderConfidence(result.confidence)}
            {//renderProbabilityBars()
            }
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Assessment</h3>
            <div className="bg-white/5 rounded-lg p-4 text-gray-100">
              <p>{result.description || gradeDescriptions[result.grade]}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Recommended Actions</h3>
            <div className="bg-white/5 rounded-lg p-4 text-gray-100">
              {result.grade === 0 && (
                <p>No specific treatment needed for arthritis. Maintain healthy joint function with regular exercise and a balanced diet.</p>
              )}
              {result.grade === 1 && (
                <p>Consider low-impact exercises, weight management if needed, and over-the-counter pain relievers during flare-ups. Monitor for progression.</p>
              )}
              {result.grade === 2 && (
                <p>Physical therapy recommended. Consider bracing or assistive devices. Discuss pain management options with healthcare provider.</p>
              )}
              {result.grade === 3 && (
                <p>Consult with orthopedic specialist. More aggressive pain management needed. Consider corticosteroid injections or hyaluronic acid supplements.</p>
              )}
              {result.grade === 4 && (
                <p>Surgical consultation recommended. Joint replacement may be beneficial. Discuss advanced pain management strategies with specialist.</p>
              )}
            </div>
          </div>
          
          {result.recommendations && (
            <div className="mt-2">
              <h3 className="font-medium mb-2">Additional Notes</h3>
              <div className="bg-white/5 rounded-lg p-4 text-gray-100">
                <p>{result.recommendations}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}