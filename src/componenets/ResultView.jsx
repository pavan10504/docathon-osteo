export default function ResultsView({ result, patient, xrayImage, onReset }) {
  const gradeDescriptions = {
    0: "No arthritis detected. The joint appears healthy.",
    1: "Mild arthritis. Minor joint space narrowing or small osteophytes.",
    2: "Moderate arthritis. Definite osteophytes and possible joint space narrowing.",
    3: "Severe arthritis. Multiple osteophytes, definite joint space narrowing, sclerosis and possible bone deformity.",
    4: "Extreme arthritis. Large osteophytes, marked joint space narrowing, severe sclerosis and definite bone deformity."
  };
  
  const gradeColors = {
    0: "bg-green-100 text-green-800",
    1: "bg-yellow-100 text-yellow-800",
    2: "bg-orange-100 text-orange-800",
    3: "bg-red-100 text-red-800",
    4: "bg-red-600 text-white"
  };
  
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
  
  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md h-[60%] w-[60%] flex flex-col">
      <div className="flex justify-between items-center mb-6 text-white">
        <h2 className="text-xl font-semibold">Analysis Results</h2>
        <button
          onClick={onReset}
          className="text-blue-600 hover:text-blue-800"
        >
          Start New Analysis
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 text-white">
        <div className="md:w-1/3">
          {xrayImage && (
            <img 
              src={xrayImage} 
              alt="X-ray" 
              className="w-full h-auto object-contain rounded-xl"
            />
          )}
        </div>
        
        <div className="md:w-2/3">
          <div className="mb-4">
            <h3 className="font-medium">Patient</h3>
            <p>{patient.name || 'Anonymous'}, {patient.age} years, {patient.sex}, {patient.weight} kg</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Arthritis Grade</h3>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${gradeColors[result.grade]}`}>
              Grade {result.grade}
            </div>
            {result.confidence && renderConfidence(result.confidence)}
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Assessment</h3>
            <p>{gradeDescriptions[result.grade]}</p>
          </div>
          
          {result.recommendations && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-2">Recommendations</h3>
              <div className="prose max-w-none">
                <p>{result.recommendations}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
