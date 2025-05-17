import Chatbot from "../componenets/chatbot"
import torso from '../assets/torso.jpg'
export default function Chat() {
    return (
        <div className="w-screen h-screen flex items-center justify-center flex-col bg-black">
            <div 
                         className="w-screen h-screen bg-no-repeat rounded-xl bg-fit bg-center flex items-center justify-center"
                            style={{ backgroundImage: `url(${torso})` }}>
                                <div className="absolute inset-0 bg-black/50 backdrop-blur flex items-center justify-center"></div>
            <Chatbot />
            </div>
        </div>
    )
}