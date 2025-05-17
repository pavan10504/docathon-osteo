import React from "react";
import { Link } from "react-router-dom";

export default function Bento(){
    return( 
        <div className="w-full h-screen">
        <div className=" absolute z-10 w-[75%] h-[70%] top-[20%] left-1/2 transform -translate-x-1/2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 h-full">
  <div className="bg-white/10 rounded-xl p-6 col-span-2 row-span-2 flex items-center justify-center text-center hover:scale-105 transition ">
  <p className="text-3xl text-white">
  <Link to="/osteo">Osteoarthritis</Link>
  </p>
  </div>
  <div className="bg-white/10 rounded-xl p-6 flex items-center justify-center hover:scale-105 transition font-pixel text-md">
  <p className=" text-md text-white">
  <Link to="/chat">Chabot</Link>
  </p>
  </div>
  <div className="bg-white/10 rounded-xl p-6 flex items-center justify-center hover:scale-105 transition font-pixel text-md">
  <p className="test-md text-white">
  <Link to="/comorbidity">Comorbidity</Link>
  </p>  </div>
  <div className="bg-white/10 rounded-xl p-6 col-span-2 flex items-center justify-center hover:scale-105 transition font-pixel">
  <p className="text-xl text-white">
  <Link to="/response">Drug Response</Link>
  </p>
  </div>
</div>

        </div>
        </div>);
}
