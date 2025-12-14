import React, { useEffect, useRef, useState, useContext } from 'react';
import StreamingAvatar, {
    AvatarQuality,
    StreamingEvents,
    TaskMode,
    TaskType,
} from '@heygen/streaming-avatar';
import { Mic, MicOff, Send, Loader2, Power, MessageSquare, Signal } from 'lucide-react';
import { AvatarContext } from '../App';

export default function Demo() {
    const [stream, setStream] = useState(null);
    const [debug, setDebug] = useState('Ready to start');
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);

    const avatar = useRef(null);
    const videoRef = useRef(null);
    const recognitionRef = useRef(null);

    const { setIsSessionActive } = useContext(AvatarContext);

    useEffect(() => {
        return () => {
            if (avatar.current) {
                avatar.current.stopAvatar();
                avatar.current = null;
            }
            setIsSessionActive(false);
        };
    }, []);

    async function startSession() {
        setIsLoading(true);
        setDebug('Initializing secure connection...');
        try {
            const response = await fetch('https://ai-avatar-backend-9opc.onrender.com/get-access-token', {
                method: 'POST',
            });
            const { token } = await response.json();

            avatar.current = new StreamingAvatar({ token });

            avatar.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
                setIsAvatarSpeaking(true);
                setDebug("Avatar is speaking...");
            });

            avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
                setIsAvatarSpeaking(false);
                setDebug("Avatar is listening...");
            });

            avatar.current.on(StreamingEvents.STREAM_READY, (event) => {
                setStream(event.detail);
                if (videoRef.current) {
                    videoRef.current.srcObject = event.detail;
                    videoRef.current.play().catch(console.error);
                }
                setDebug('Session Active');
                setIsLoading(false);
                setIsSessionActive(true);
            });

            avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
                setStream(null);
                setDebug('Session ended');
                setIsLoading(false);
                setIsSessionActive(false);
            });

            await avatar.current.createStartAvatar({
                quality: AvatarQuality.Low,
                avatarName: 'ef08039a41354ed5a20565db899373f3',
            });

        } catch (error) {
            console.error(error);
            setDebug('Connection Failed');
            setIsLoading(false);
            setIsSessionActive(false);
        }
    }

    async function endSession() {
        await avatar.current?.stopAvatar();
        setStream(null);
    }

    async function handleSpeak(manualText = null) {
        const textToSend = manualText || text;
        if (!textToSend) return;

        setText('');
        setDebug(`Processing...`);

        try {
            const response = await fetch('https://ai-avatar-backend-9opc.onrender.com/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToSend })
            });

            const data = await response.json();
            const aiResponse = data.reply;

            if (avatar.current) {
                await avatar.current.speak({
                    text: aiResponse,
                    task_type: TaskType.REPEAT,
                    taskMode: TaskMode.SYNC
                });
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setDebug('Error getting AI response.');
        }
    }

    function toggleRecording() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Browser not supported");

        if (!isListening) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsListening(true);
                setDebug("Listening...");
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                handleSpeak(transcript);
            };

            recognition.onend = () => setIsListening(false);
            recognition.onerror = () => setIsListening(false);

            recognition.start();
            recognitionRef.current = recognition;
        } else {
            if (recognitionRef.current) recognitionRef.current.stop();
            setIsListening(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 pt-20 font-sans selection:bg-indigo-500/30">
            <div className="w-full max-w-4xl bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm relative flex flex-col h-[85vh]">

                <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white/90">AI Assistant</h1>
                        <p className="text-sm text-zinc-400 font-medium flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${stream ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                            {debug}
                        </p>
                    </div>

                    {stream && (
                        <div className="flex gap-2">
                            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2 text-xs font-semibold text-white/80">
                                <Signal size={14} className={isAvatarSpeaking ? "text-emerald-400" : "text-zinc-500"} />
                                {isAvatarSpeaking ? 'SPEAKING' : 'IDLE'}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 relative bg-zinc-950 flex items-center justify-center overflow-hidden group">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover opacity-90 transition-opacity duration-700 group-hover:opacity-100"
                    />

                    {!stream && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-20">
                            <div className="w-24 h-24 bg-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 blur-lg absolute opacity-50 animate-pulse"></div>
                                <MessageSquare size={40} className="text-white relative z-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Interactive AI Avatar</h2>
                            <p className="text-zinc-400 max-w-sm text-center mb-8">
                                Start a real-time conversation with a generative AI avatar.
                            </p>

                            <button
                                onClick={startSession}
                                disabled={isLoading}
                                className="px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <Power size={18} />}
                                {isLoading ? 'Connecting...' : 'Start Conversation'}
                            </button>
                        </div>
                    )}
                </div>

                {stream && (
                    <div className="h-24 bg-zinc-950/80 backdrop-blur-md border-t border-white/5 p-4 flex items-center justify-center gap-4 z-20 relative">
                        <div className="flex-1 max-w-lg relative group">
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSpeak()}
                                placeholder="Type a message..."
                                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-full pl-6 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-zinc-800 transition-all shadow-sm placeholder:text-zinc-500"
                            />
                            <button
                                onClick={() => handleSpeak()}
                                className="absolute right-2 top-1.5 p-2 bg-zinc-700 hover:bg-indigo-600 rounded-full transition-colors text-white"
                            >
                                <Send size={16} />
                            </button>
                        </div>

                        <div className="w-px h-8 bg-zinc-800 mx-2 hidden sm:block"></div>

                        <button
                            onClick={toggleRecording}
                            className={`p-4 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center ${
                                isListening
                                    ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/30'
                                    : 'bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105'
                            }`}
                        >
                            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                        </button>

                        <button
                            onClick={endSession}
                            className="p-4 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all duration-300 flex items-center justify-center"
                            title="End Session"
                        >
                            <Power size={22} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
