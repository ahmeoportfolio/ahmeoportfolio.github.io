import React, { useState } from 'react';
import '../styles/components.css';

export function PromptInput({ onGenerate }) {
    const [prompt, setPrompt] = useState('');

    const handleGenerate = () => {
        onGenerate(prompt);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleGenerate();
    };

    const suggestions = [
        '808 Cowbell', 'Glitch', 'Jazz Fusion', 'Afrobeat', 'Lo-Fi', 'Stadium Rock', 'Ambient'
    ];

    return (
        <div className="prompt-section">
            <div className="input-group">
                <input
                    className="beat-input"
                    type="text"
                    placeholder="Describe your beat (e.g., 'minimal techno', 'trap drums', 'vintage funk')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="btn-generate" onClick={handleGenerate}>
                    Generate
                </button>
            </div>

            <div className="suggestions">
                <span>Try These:</span>
                {suggestions.map(s => (
                    <button
                        key={s}
                        className="chip"
                        onClick={() => {
                            setPrompt(s);
                            onGenerate(s);
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>
            <hr style={{ border: 'none', borderBottom: '1px solid var(--color-border)', margin: '0.5rem 0' }} />
        </div>
    );
}
