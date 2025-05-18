import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function ResultsView({ result, patient, xrayImage, onReset }) {
  const [viewMode, setViewMode] = useState('original'); // 'original' or 'gradcam'
  const [dietPlan, setDietPlan] = useState(null);
  const [dietHtml, setDietHtml] = useState(null);
  const [isLoadingDiet, setIsLoadingDiet] = useState(false);
  
  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI("AIzaSyCffQ9yiCAni2PXXGQanarf00tDCvGEA-Q");
  
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

  // Get HTML diet recommendations from Gemini using the Google AI SDK
  const fetchDietRecommendations = async () => {
    setIsLoadingDiet(true);
    try {
      // Create the model with system instructions
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are an expert orthopedic doctor and nutritionist specializing in arthritis management. You provide detailed, visually appealing HTML content for diet plans based on arthritis severity."
      });
      
      // Create prompt for the model based on patient data and arthritis grade
      const prompt = `
        Create a professionally designed, visually appealing HTML diet plan for a patient with the following information:
        - Arthritis Grade: ${result.grade} (${result.label || `Grade ${result.grade}`})
        - Age: ${patient.age} years
        - Sex: ${patient.sex}
        - Weight: ${patient.weight} kg
        
        The HTML should include:
        1. A beautiful header with an appropriate title for the nutrition plan
        2. A professional introduction explaining the dietary approach
        3. A visually organized section of recommended foods that can help manage arthritis
        4. A clearly separate section of foods to avoid or limit
        5. A section on appropriate supplements to consider
        6. A disclaimer about consulting healthcare providers

        Use appropriate colors, styles, and layout to make this look like a professional medical document.
        The HTML should be complete and standalone with all CSS included inline.
        Design it to print well as a PDF.
        
        IMPORTANT: Respond ONLY with valid HTML. Do not include markdown code blocks, explanations, or any text outside the HTML.
      `;
      
      // Generate content
      const contentParts = [{ text: prompt }];
      const generationResult = await model.generateContent({
        contents: [{ role: "user", parts: contentParts }]
      });
      
      const response = generationResult.response;
      const htmlContent = response.text();
      
      // Set the HTML content to state
      setDietHtml(htmlContent);
      
      // Also parse basic information for the UI display
      try {
        // Extract title from HTML (simplistic approach)
        const titleMatch = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i) || 
                          htmlContent.match(/<h2[^>]*>(.*?)<\/h2>/i) ||
                          htmlContent.match(/<title[^>]*>(.*?)<\/title>/i);
        
        // Create a simplified diet plan object for UI rendering
        const simplifiedPlan = {
          title: titleMatch ? titleMatch[1] : `Arthritis Grade ${result.grade} Diet Plan`,
          description: "A personalized nutrition plan has been generated for you. Click 'Download PDF' to save the complete detailed plan.",
          foods: {
            recommended: ["See full PDF for complete recommendations"],
            avoid: ["See full PDF for complete list of foods to avoid"]
          },
          supplements: ["See full PDF for supplement recommendations"]
        };
        
        setDietPlan(simplifiedPlan);
      } catch (parseError) {
        console.error("Error extracting basic info from HTML:", parseError);
        setDietPlan(getDefaultDietRecommendations(result.grade));
      }
    } catch (error) {
      console.error('Error fetching diet recommendations from Gemini:', error);
      // Fallback to predefined diet recommendations if API call fails
      setDietPlan(getDefaultDietRecommendations(result.grade));
      setDietHtml(getDefaultDietHtml(result.grade));
    } finally {
      setIsLoadingDiet(false);
    }
  };

  // Default fallback diet recommendations based on arthritis grade
  const getDefaultDietRecommendations = (grade) => {
    const recommendations = {
      0: {
        title: "Preventative Nutrition Plan",
        description: "While no arthritis is detected, these dietary guidelines can help maintain joint health and prevent future issues.",
        foods: {
          recommended: [
            "Fatty fish rich in omega-3 (salmon, mackerel, sardines)",
            "Colorful fruits and vegetables (berries, leafy greens)",
            "Nuts and seeds (walnuts, flax seeds)",
            "Whole grains",
            "Lean proteins"
          ],
          avoid: [
            "Excessive sugar",
            "Highly processed foods",
            "Trans fats"
          ]
        },
        supplements: ["Vitamin D", "Calcium"]
      },
      1: {
        title: "Mild Arthritis Nutrition Plan",
        description: "These dietary changes may help reduce mild inflammation and support joint health.",
        foods: {
          recommended: [
            "Anti-inflammatory foods (turmeric, ginger)",
            "Omega-3 rich foods (fatty fish, flaxseeds)",
            "Colorful fruits and vegetables (especially berries)",
            "Olive oil",
            "Green tea"
          ],
          avoid: [
            "Red meat (limit to once weekly)",
            "Added sugars",
            "Refined carbohydrates",
            "Processed foods"
          ]
        },
        supplements: ["Omega-3 fatty acids", "Turmeric/Curcumin", "Vitamin D"]
      },
      2: {
        title: "Moderate Arthritis Nutrition Plan",
        description: "This anti-inflammatory diet approach may help manage moderate arthritis symptoms.",
        foods: {
          recommended: [
            "Fatty fish (3-4 servings weekly)",
            "Mediterranean diet components",
            "Tart cherries and berries",
            "Cruciferous vegetables",
            "Nuts and seeds",
            "Plant-based proteins"
          ],
          avoid: [
            "Red and processed meats",
            "Dairy (if it triggers symptoms)",
            "Nightshade vegetables (if sensitive)",
            "Alcohol",
            "Added sugars"
          ]
        },
        supplements: ["Glucosamine and chondroitin", "MSM", "Fish oil", "Vitamin D"]
      },
      3: {
        title: "Advanced Arthritis Nutrition Plan",
        description: "This comprehensive nutrition plan aims to reduce inflammation and support joint function.",
        foods: {
          recommended: [
            "Anti-inflammatory diet (Mediterranean or DASH diet)",
            "Fatty fish (4+ servings weekly)",
            "Bone broth",
            "Tart cherry juice",
            "Turmeric with black pepper",
            "Ginger",
            "Antioxidant-rich foods"
          ],
          avoid: [
            "All processed foods",
            "Added sugars",
            "Refined carbohydrates",
            "Fried foods",
            "Dairy (unless organic and fermented)",
            "Gluten (if sensitive)"
          ]
        },
        supplements: ["High-dose fish oil", "Turmeric/curcumin", "Vitamin D", "Collagen peptides"]
      },
      4: {
        title: "Severe Arthritis Nutrition Therapy",
        description: "This intensive nutritional approach should complement medical treatment for severe arthritis.",
        foods: {
          recommended: [
            "Strictly anti-inflammatory foods",
            "Low-FODMAP diet if bloating occurs",
            "Small, frequent nutrient-dense meals",
            "Cold-water fish",
            "Bone broth daily",
            "Fresh herbs and spices",
            "Low-glycemic fruits"
          ],
          avoid: [
            "All inflammatory triggers (personalized)",
            "Sugar and artificial sweeteners",
            "All processed foods",
            "Gluten and dairy",
            "Nightshades",
            "Alcohol and caffeine"
          ]
        },
        supplements: ["Clinical-strength omega-3", "Curcumin with enhanced bioavailability", "Vitamin D with K2", "Proteolytic enzymes", "MSM", "Type II collagen"]
      }
    };
    
    return recommendations[grade];
  };
  
  // Get default HTML for the diet plan
  const getDefaultDietHtml = (grade) => {
    const plan = getDefaultDietRecommendations(grade);
    
    return `
      <html>
      <head>
        <title>${plan.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
          }
          h2 {
            color: #2980b9;
            margin-top: 25px;
          }
          .section {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .foods-container {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
          }
          .food-column {
            flex: 0 0 48%;
          }
          .recommended {
            background-color: #e8f5e9;
            border-left: 4px solid #4caf50;
            padding: 10px 15px;
          }
          .avoid {
            background-color: #ffebee;
            border-left: 4px solid #f44336;
            padding: 10px 15px;
          }
          .supplements {
            background-color: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 10px 15px;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin-bottom: 8px;
          }
          .disclaimer {
            font-style: italic;
            font-size: 0.9em;
            color: #7f8c8d;
            margin-top: 30px;
            border-top: 1px solid #ecf0f1;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <h1>${plan.title}</h1>
        
        <div class="section">
          <p>${plan.description}</p>
        </div>
        
        <h2>Dietary Recommendations</h2>
        <div class="foods-container">
          <div class="food-column">
            <div class="recommended">
              <h3>Recommended Foods</h3>
              <ul>
                ${plan.foods.recommended.map(food => `<li>${food}</li>`).join('')}
              </ul>
            </div>
          </div>
          
          <div class="food-column">
            <div class="avoid">
              <h3>Foods to Avoid/Limit</h3>
              <ul>
                ${plan.foods.avoid.map(food => `<li>${food}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
        
        <h2>Supplement Recommendations</h2>
        <div class="supplements">
          <ul>
            ${plan.supplements.map(supp => `<li>${supp}</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h2>Meal Planning Tips</h2>
          <ul>
            <li>Aim for 5-6 small meals throughout the day to maintain energy levels</li>
            <li>Include protein with each meal to support tissue repair</li>
            <li>Stay well hydrated - aim for 8 glasses of water daily</li>
            <li>Consider keeping a food journal to identify potential trigger foods</li>
          </ul>
        </div>
        
        <div class="disclaimer">
          <p><strong>Disclaimer:</strong> This diet plan is provided as general guidance and should not replace professional medical advice. Please consult with your healthcare provider before making significant dietary changes or starting any supplement regimen.</p>
        </div>
      </body>
      </html>
    `;
  };

  // Generate and download PDF from HTML content
  const generatePDF = () => {
    if (!dietHtml) {
      console.error("No HTML content available for PDF generation");
      alert("Diet plan data is still loading. Please try again in a moment.");
      return;
    }
    
    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.innerHTML = dietHtml;
    document.body.appendChild(tempDiv);
    
    // Add patient information to the HTML before generating PDF
    const patientInfoDiv = document.createElement('div');
    patientInfoDiv.innerHTML = `
      <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <h3 style="margin-top: 0; color: #495057;">Patient Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px; color: #6c757d;">Name:</td>
            <td style="padding: 5px;">${patient.name || 'Anonymous'}</td>
          </tr>
          <tr>
            <td style="padding: 5px; color: #6c757d;">Age:</td>
            <td style="padding: 5px;">${patient.age} years</td>
          </tr>
          <tr>
            <td style="padding: 5px; color: #6c757d;">Sex:</td>
            <td style="padding: 5px;">${patient.sex}</td>
          </tr>
          <tr>
            <td style="padding: 5px; color: #6c757d;">Weight:</td>
            <td style="padding: 5px;">${patient.weight} kg</td>
          </tr>
          <tr>
            <td style="padding: 5px; color: #6c757d;">Arthritis Grade:</td>
            <td style="padding: 5px;">${result.label || `Grade ${result.grade}`}</td>
          </tr>
        </table>
      </div>
    `;
    
    // Find the body element in the tempDiv and insert patient info at the top
    const bodyElement = tempDiv.querySelector('body');
    if (bodyElement && bodyElement.firstChild) {
      bodyElement.insertBefore(patientInfoDiv, bodyElement.firstChild);
    }
    
    // Add assessment information
    const assessmentDiv = document.createElement('div');
    assessmentDiv.innerHTML = `
      <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <h3 style="margin-top: 0; color: #495057;">X-ray Assessment</h3>
        <p>${result.description || gradeDescriptions[result.grade]}</p>
      </div>
    `;
    
    if (bodyElement && patientInfoDiv.nextSibling) {
      bodyElement.insertBefore(assessmentDiv, patientInfoDiv.nextSibling);
    } else if (bodyElement) {
      bodyElement.appendChild(assessmentDiv);
    }
    
    // Add a header with logo and date
    const headerDiv = document.createElement('div');
    const currentDate = new Date().toLocaleDateString();
    headerDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
        <div>
          <h1 style="margin: 0; color: #343a40;">Arthritis Management Report</h1>
          <p style="margin: 5px 0 0 0; color: #6c757d;">Generated on ${currentDate}</p>
        </div>
      </div>
    `;
    
    if (bodyElement && bodyElement.firstChild) {
      bodyElement.insertBefore(headerDiv, bodyElement.firstChild);
    } else if (bodyElement) {
      bodyElement.appendChild(headerDiv);
    }
    
    // Add X-ray image if available
    if (xrayImage) {
      const xrayDiv = document.createElement('div');
      xrayDiv.innerHTML =
        <div style="margin-bottom: 20px; text-align: center;">
          <h3 style="color: #495057;">X-ray Image</h3>
          <img src="${xrayImage}" alt="X-ray" style="max-width: 100%; max-height: 300px; border: 1px solid #dee2e6; border-radius: 5px;"/>
        </div>;
      
      if (bodyElement && assessmentDiv.nextSibling) {
        bodyElement.insertBefore(xrayDiv, assessmentDiv.nextSibling);
      } else if (bodyElement) {
        bodyElement.appendChild(xrayDiv);
      }
    }
    
    // Ensure the content is fully loaded before generating PDF
    setTimeout(() => {
      // PDF generation options
      const opt = {
        margin: [15, 15, 15, 15],
        filename: `${patient.name || 'Patient'}_Arthritis_Diet_Plan.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Generate PDF with error handling
      html2pdf()
        .from(tempDiv)
        .set(opt)
        .save()
        .then(() => {
          // Clean up the temporary div after PDF generation
          document.body.removeChild(tempDiv);
        })
        .catch(error => {
          console.error('Error generating PDF:', error);
          alert('There was an error generating the PDF. Please try again.');
          document.body.removeChild(tempDiv);
        });
    }, 500); // Small delay to ensure content is rendered
  };

  // Fetch diet recommendations when results are available
   useEffect(() => {
    if (result && result.grade !== undefined && patient) {
      fetchDietRecommendations();
    }
  }, [result, patient]);
  
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
  
  // Handle PDF download errors
  const handleDownloadClick = () => {
    try {
      generatePDF();
    } catch (error) {
      console.error('Error in PDF generation:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };
  
  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md h-[80%] w-[70%] flex flex-col">
      <div className="flex justify-between items-center mb-6 text-white">
        <h2 className="text-xl font-semibold">X-ray Analysis Results</h2>
        <div className="flex space-x-4">
          
          <button
            onClick={onReset}
            className="text-blue-400 hover:text-blue-300 flex items-center font-thin cursor-pointer"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Analysis
          </button>
        </div>
      </div>
      
      <div id="report-content" className="flex flex-col md:flex-row gap-6 text-white h-full overflow-auto">
        <div className="md:w-1/3">
          {xrayImage && (
            <div className="mb-4">
              <h3 className="font-normal mb-2">X-ray Image</h3>
              
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
              <div className="relative w-full h-32 sm:h-64 md:h-40 border border-gray-600 rounded-xl overflow-hidden">
                <img 
                  src={viewMode === 'original' ? xrayImage : (result.gradcam || xrayImage)} 
                  alt={viewMode === 'original' ? "X-ray" : "X-ray with GradCAM overlay"}
                  className="absolute w-full h-full object-stretch rounded-xl"
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
          
          {dietPlan && (
            <div className="mb-4">
              <div className="flex  items-center">
                <button
                  onClick={handleDownloadClick}
                  disabled={isLoadingDiet}
                  className={`text-blue-500  px-3 py-1 rounded-md text-sm flex items-center ${isLoadingDiet ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-blue-200'}`}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Diet Plan PDF
                </button>
              </div>
              
            </div>
          )}
          
          {isLoadingDiet && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-400"></div>
              <span className="ml-3 text-gray-300">Generating diet recommendations...</span>
            </div>
          )}
          
          {/*result.probabilities && Object.keys(result.probabilities).length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Probability Distribution</h3>
              <div className="bg-white/5 rounded-lg p-4">
                {Object.entries(result.probabilities).map(([label, probability]) => {
                  const percent = Math.round(probability * 100);
                  return (
                    <div key={label} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">{label}</span>
                        <span className="text-sm text-gray-300">{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`${
                            result.grade === parseInt(label.split(':')[0].trim()) ? 'bg-blue-500' : 'bg-gray-500'
                          } h-2 rounded-full`}
                          style={{ width: `${percent}%` }}>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )*/}
          
          <div className="text-sm text-gray-400 mt-6">
            <p>
              <span className="font-medium">Note:</span> This assessment is based on AI analysis and should be used as a reference only. 
              Please consult with a qualified healthcare professional for definitive diagnosis and treatment recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}