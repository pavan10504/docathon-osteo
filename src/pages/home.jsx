import Bento from "../componenets/bento";
import bg from "../assets/home.jpg";
export default function Home(){
    return(
        <div className="w-screen h-screen flex items-center justify-center flex-col ">
            <img src={bg} alt="bg" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center">
            <Bento />
            </div>
            </div>
    )
}