import { SendHorizontal, Image as ImageIcon, X, AudioWaveform } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import torso from '../assets/torso2.png';


export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const fileInputRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const chatContainerRef = useRef(null);

    const key = "AIzaSyCffQ9yiCAni2PXXGQanarf00tDCvGEA-Q"
    const genAI = new GoogleGenerativeAI(key);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (inputMessage.trim() === "" && selectedImages.length === 0) return;
        const userMessage = {
            text: inputMessage,
            sender: "user",
            images: imagePreviewUrls
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash-8b", 
                systemInstruction: "you are a very helpful ortho doctor,You are the best in your field and can answer anything related to ortho and stuff.Dont answer questions other than these topics, like u should not answer questions related to cricket and stuff....say u are limited" 
            });

            const contentParts = [{ text: inputMessage }];

            if (selectedImages.length > 0) {
                for (const image of selectedImages) {
                    const imageData = await readFileAsBase64(image);
                    contentParts.push({
                        inlineData: {
                            data: imageData.split(',')[1],
                            mimeType: image.type
                        }
                    });
                }
            }

            const result = await model.generateContent({
                contents: [{ role: "user", parts: contentParts }]
            });

            const response = result.response;
            const responseText = response.text();

            setMessages(prev => [...prev, {
                text: responseText,
                sender: "bot"
            }]);

        } catch (error) {
            console.error("Error generating response:", error);
            setMessages(prev => [...prev, {
                text: "Sorry, I encountered an error. Please try again.",
                sender: "bot"
            }]);
        } finally {
            setIsLoading(false);
            setInputMessage("");
            setSelectedImages([]);
            setImagePreviewUrls([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setSelectedImages(prevImages => [...prevImages, ...files]);

        const newImageUrls = files.map(file => URL.createObjectURL(file));
        setImagePreviewUrls(prevUrls => [...prevUrls, ...newImageUrls]);

        e.target.value = null;
    };

    const handleRemoveImage = (index) => {
        setSelectedImages(prevImages => {
            const updated = [...prevImages];
            updated.splice(index, 1);
            return updated;
        });

        setImagePreviewUrls(prevUrls => {
            URL.revokeObjectURL(prevUrls[index]);
            const updated = [...prevUrls];
            updated.splice(index, 1);
            return updated;
        });
    };
    
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.warn("Speech Recognition not supported");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputMessage(prev => prev + " " + transcript);
        };

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);

        recognitionRef.current = recognition;
    }, []);

    useEffect(() => {
        const savedMessages = sessionStorage.getItem("chat-messages");
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem("chat-messages", JSON.stringify(messages));
    }, [messages]);

    const handleMicClick = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
        }
    };
    
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="fixed top-[10%] rounded-xl h-[80%] left-[20%] w-[70%] flex flex-col overflow-hidden">
            {/* Background with torso image and overlay */}
            <div 
                className="w-full h-full absolute bg-no-repeat rounded-xl bg-fit bg-center"
                style={{ backgroundImage: `url(${torso})` }}>
            </div>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl border border-white/10">
               
                {/* Logo */}
                <div className="mt-4 ml-[85%] h-[10%] text-3xl text-white font-light tracking-widest">
                    <p className="flex flex-row">
                        MEDI
                    </p>
                </div>
                
                {/* Chat container */}
                <div
                    ref={chatContainerRef}
                    className="h-[70%] overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-400  scrollbar-track-black"
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"}`}
                        >
                            <div
                                className={`inline-block max-w-[70%] rounded-lg p-3 ${
                                    message.sender === "user"
                                        ? "bg-white/10 text-white border border-white/20"
                                        : "bg-black/30 text-white border border-white/10"
                                }`}
                            >
                                {message.images && message.images.length > 0 && (
                                    <div className="mb-2 flex flex-wrap gap-2 items-center">
                                        {message.images.map((imgUrl, imgIndex) => (
                                            <img
                                                key={imgIndex}
                                                src={imgUrl}
                                                alt={`User uploaded ${imgIndex}`}
                                                className="w-16 h-16 object-cover rounded-md border border-white/20"
                                            />
                                        ))}
                                    </div>
                                )}
                                <div className={`${message.sender === 'user' ? 'font-pixel text-xs' : 'font-pixel text-xs prose prose-sm prose-invert'}`}>
                                    <ReactMarkdown>
                                        {message.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="text-left">
                            <div className="inline-block bg-black/30 rounded-lg p-3 border border-white/10">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input container */}
                <div className="h-[15%] flex flex-col items-center">
                    <div className="w-[60%] relative">
                        {/* Image preview area */}
                        {imagePreviewUrls.length > 0 && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                <div className="flex flex-wrap gap-2 justify-start">
                                    {imagePreviewUrls.map((url, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={url}
                                                alt={`Preview ${index}`}
                                                className="w-16 h-16 object-cover rounded-md border border-white/30"
                                            />
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute -top-2 -right-2 bg-black/70 rounded-full p-1 hover:bg-white/20 transition-colors border border-white/30"
                                                aria-label="Remove image"
                                            >
                                                <X size={12} className="text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input area */}
                        <div className="w-full bg-black/50 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                            <div className="w-full rounded-lg flex items-center p-2">
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask me anything..."
                                    className="w-full font-pixel text-xs text-white tracking-wider bg-transparent border-none resize-none outline-none h-8 placeholder-white/50"
                                />

                                <button
                                    onClick={handleMicClick}
                                    className={`text-white/70 hover:text-white transition-colors ${isRecording ? 'text-red-700' : ''}`}
                                >
                                    <AudioWaveform size={18} />
                                </button>

                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="mx-2 text-white/70 hover:text-white transition-colors"
                                    aria-label="Upload image"
                                >
                                    <ImageIcon size={18} />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />

                                <button
                                    onClick={handleSendMessage}
                                    className="text-white/70 hover:text-white transition-colors"
                                    aria-label="Send message"
                                >
                                    <SendHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}