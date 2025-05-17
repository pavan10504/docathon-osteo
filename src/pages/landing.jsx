import landing from'../assets/landing.jpg'

export default function Landing() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black overflow-hidden">
            <div 
             className="w-screen h-screen bg-no-repeat rounded-xl bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${landing})` }}>
                    <div className="absolute inset-0 bg-black/15 backdrop-blur flex items-center justify-center">
                    <div className="w-[90%] sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 border-black border-[3px] rounded-xl overflow-hidden hover:shadow-[14px_14px_0px_rgba(192,192,192,1)] bg-black mt-8">
                        <a href="/home" className="block cursor-pointer">
                            <article className="w-full h-3/4">
                                

                                <div className="px-6 py-5 text-left h-full BORDER BLACK BORDER-3">
                                    <h1 className="text-4xl mb-4 text-white font-pixel">MEDIMORPH</h1>
                                    <p className="mb-4  text-xs font-semibold text-white font-pixel break-all hyphens-auto">
                                   The challenge we're solving is improving osteoarthritis (OA) diagnosis and treatment through AI-driven solutions. By  leveraging deep learning models to predict knee osteoarthritis severity, machine learning to personalize drug response, and predict comorbidity risks, we aim to enhance early detection, provide tailored treatments, and ensure proactive patient management, ultimately improving outcomes and reducing healthcare costs.
                                    </p>
                                    <p className="hover:text-blue-500 text-[10px] text-white font-pixel mt-10">click on this to dive in</p>
                                </div>
                            </article>
                        </a>
                    </div>
                    </div>

                </div>
        </div>
    );
}