import React, { useRef } from 'react';
import '../styles/components.css';

const INSTRUMENTS = ['kick', 'snare', 'hihat', 'openhat', 'clap'];

export function Sequencer({ grid, onToggle, currentStep, isPlaying, onUpload }) {
    const fileInputRefs = useRef({});

    const handleUploadClick = (inst) => {
        if (fileInputRefs.current[inst]) {
            fileInputRefs.current[inst].click();
        }
    };

    const handleFileChange = (inst, e) => {
        const file = e.target.files[0];
        if (file && onUpload) {
            onUpload(inst, file);
        }
    };

    return (
        <div className="sequencer-container">
            {INSTRUMENTS.map((inst) => (
                <div key={inst} className="track-row">
                    <div className="instrument-controls" style={{ display: 'flex', alignItems: 'center', width: '100px', gap: '8px' }}>
                        <span className="instrument-label" style={{ minWidth: 'auto', marginRight: 0 }}>{inst}</span>
                        <input
                            type="file"
                            accept="audio/*"
                            style={{ display: 'none' }}
                            ref={el => fileInputRefs.current[inst] = el}
                            onChange={(e) => handleFileChange(inst, e)}
                        />
                        <button
                            className="btn-upload"
                            onClick={() => handleUploadClick(inst)}
                            title="Upload custom sound"
                            style={{
                                padding: '2px 6px',
                                fontSize: '0.7rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                background: '#f0f0f0',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ↑
                        </button>
                    </div>
                    <div className="steps-grid">
                        {grid[inst].map((isActive, index) => (
                            <button
                                key={index}
                                className={`step-cell ${isActive ? 'active' : ''} ${isPlaying && currentStep === index ? 'playing' : ''
                                    }`}
                                onClick={() => onToggle(inst, index)}
                                aria-label={`Toggle ${inst} step ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
