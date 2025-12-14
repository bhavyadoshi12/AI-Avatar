import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Demo from './pages/Demo';
import { AlertTriangle } from 'lucide-react';

export const AvatarContext = createContext();

function AppContent() {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [pendingPath, setPendingPath] = useState(null);
    const navigate = useNavigate();

    const handleNavigationAttempt = (path) => {
        if (isSessionActive) {
            setPendingPath(path);
            setShowExitModal(true);
        } else {
            navigate(path);
        }
    };

    const confirmExit = () => {
        setIsSessionActive(false);
        setShowExitModal(false);
        if (pendingPath) navigate(pendingPath);
    };

    return (
        <AvatarContext.Provider value={{ isSessionActive, setIsSessionActive, handleNavigationAttempt }}>
            <div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans">
                <Navbar />

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/demo" element={<Demo />} />
                    </Routes>
                </main>

                <Footer />

                {showExitModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100">
                            <div className="flex items-center gap-3 text-amber-500 mb-4">
                                <AlertTriangle size={28} />
                                <h3 className="text-xl font-bold text-white">End Conversation?</h3>
                            </div>
                            <p className="text-zinc-400 mb-6">
                                Leaving this page will disconnect your live session with the AI Avatar.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowExitModal(false)}
                                    className="px-4 py-2 text-zinc-300 hover:text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmExit}
                                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-lg"
                                >
                                    End & Leave
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AvatarContext.Provider>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
