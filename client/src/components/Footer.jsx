import React from 'react';

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-zinc-950 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-zinc-500 text-sm">
                    Built with React, HeyGen API & Google Gemini.
                </p>
                <p className="text-zinc-600 text-xs mt-2">
                    © {new Date().getFullYear()} AvatarAI Project. All rights reserved.
                </p>
            </div>
        </footer>
    );
}