import React from 'react';
import '../styles/components.css';

const PRESETS = [
    { label: 'Techno', prompt: 'techno' },
    { label: 'House', prompt: 'house' },
    { label: 'Trap', prompt: 'trap' },
    { label: 'Breakbeat', prompt: 'breakbeat' },
    { label: 'Minimal', prompt: 'minimal' }
];

export function Presets({ onSelect }) {
    return (
        <div className="presets-container">
            {PRESETS.map((preset) => (
                <button
                    key={preset.label}
                    className="btn-preset"
                    onClick={() => onSelect(preset.prompt)}
                >
                    {preset.label}
                </button>
            ))}
        </div>
    );
}
