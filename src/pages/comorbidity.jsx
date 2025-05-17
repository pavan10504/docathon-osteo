import { Link } from 'react-router-dom';

export default function Comorbidity() {
    return (
        <div>
            <div className='z-20 flex flex-col fixed left-6 top-[45%] translate-y-[-50%] w-auto'>
                <div className="relative group inline-block w-full cursor-pointer">
                    <Link to='/osteo'>
                        <button className=" mb-2 p-4 w-full bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 cursor-pointer">
                            <span className="relative z-10 flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6,12 C6,8.7 8.7,6 12,6 C15.3,6 18,8.7 18,12 C18,15.3 15.3,18 12,18 C8.7,18 6,15.3 6,12 Z" stroke="white" strokeWidth="1.5" fill="none" />
                                    <path d="M9,9 L15,15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M9,15 L15,9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M7.5,7.5 L5,5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M16.5,7.5 L19,5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M7.5,16.5 L5,19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M16.5,16.5 L19,19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                Osteoarthritis
                            </span>
                        </button>
                    </Link>
                    <div className="absolute hidden group-hover:block bg-white text-sm text-gray-800 px-3 py-2 rounded shadow-md mt-2 z-10">
                        Osteoarthritis Prediction
                    </div>
                </div>
                <div className="relative group inline-block w-full cursor-pointer">
                    <Link to='/response'>
                        <button className=" mb-2 p-4 w-full bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 cursor-pointer">
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
            </div>
            <iframe src="https://osteoarthritis-comorbidity.onrender.com/" className="w-full h-screen" />
        </div>
    );
}