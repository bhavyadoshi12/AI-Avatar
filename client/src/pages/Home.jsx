import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Mic, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto text-center mb-24 mt-12">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                    The Future of <br /> AI Interaction
                </h1>

                <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Experience a real-time, interactive video avatar that can see, hear, and respond instantly using advanced LLMs and streaming technology.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/demo"
                        className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        Try Live Demo <ArrowRight size={18} />
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard
                    icon={<Bot size={32} className="text-blue-500" />}
                    title="Interactive Avatar"
                    desc="Uses HeyGen's Streaming API to generate lip-synced video in real-time."
                />
                <FeatureCard
                    icon={<Zap size={32} className="text-yellow-500" />}
                    title="Instant Responses"
                    desc="Powered by Google Gemini Flash for sub-second conversational latency."
                />
                <FeatureCard
                    icon={<Mic size={32} className="text-emerald-500" />}
                    title="Voice Control"
                    desc="Talk naturally with built-in speech-to-text integration."
                />
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-colors">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-zinc-400 leading-relaxed">{desc}</p>
        </div>
    );
}
