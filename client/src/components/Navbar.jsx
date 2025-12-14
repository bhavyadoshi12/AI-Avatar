import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Github } from 'lucide-react';
import { AvatarContext } from '../App';

export default function Navbar() {
    const location = useLocation();
    const { handleNavigationAttempt } = useContext(AvatarContext);

    const isActive = (path) => location.pathname === path
        ? "text-white bg-white/10"
        : "text-zinc-400 hover:text-white hover:bg-white/5";

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                <button
                    onClick={() => handleNavigationAttempt('/')}
                    className="flex items-center gap-2 font-bold text-xl tracking-tight text-white focus:outline-none"
                >
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <MessageSquare size={18} className="text-white" />
                    </div>
                    AvatarAI
                </button>

                <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-full border border-white/5">
                    <button
                        onClick={() => handleNavigationAttempt('/')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isActive('/')}`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => handleNavigationAttempt('/demo')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isActive('/demo')}`}
                    >
                        Live Demo
                    </button>
                </div>

                <a
                    href="https://github.com/bhavyadoshi12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                    title="GitHub Profile"
                >
                    <Github size={20} />
                </a>

            </div>
        </nav>
    );
}
