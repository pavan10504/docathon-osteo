import { useState, useEffect } from 'react';

export default function PatientForm({ onSubmit, patientData }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    weight: ''
  });
  
  useEffect(() => {
    if (patientData) {
      setFormData(patientData);
    }
  }, [patientData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">Patient Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Name (Optional)</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-gray-100"
            placeholder="Patient name"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Age <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-gray-100"
              placeholder="Years"
              required
              min="0"
              max="120"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-1">Sex <span className="text-red-500">*</span></label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-gray-100"
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-1 ">Weight <span className="text-red-500">*</span></label>
            <div className="flex">
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 border rounded-l-md bg-gray-100"
                placeholder="kg"
                required
                min="0"
                max="500"
              />
              <span className="bg-gray-100 px-3 flex items-center border-t border-r border-b rounded-r-md">
                kg
              </span>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          disabled={patientData !== null}
        >
          {patientData ? 'Information Saved' : 'Save Information'}
        </button>
      </form>
    </div>
  );
}
