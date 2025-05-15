export default function XrayUpload({ onFileUpload, preview }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileUpload(file);
    }
  };
  
  return (
    <div className="mt-6 bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">X-ray Upload</h2>
      
      {preview ? (
        <div className="mt-4">
          <img 
            src={preview} 
            alt="X-ray preview" 
            className="w-full max-h-64 object-contain bg-black rounded-xl"
          />
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
          <input
            type="file"
            id="xray-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label 
            htmlFor="xray-upload"
            className="cursor-pointer block"
          >
            <div className="text-blue-600 mb-2">Click to upload knee X-ray</div>
            <p className="text-sm text-gray-500">JPEG, PNG or DICOM</p>
          </label>
        </div>
      )}
    </div>
  );
}
