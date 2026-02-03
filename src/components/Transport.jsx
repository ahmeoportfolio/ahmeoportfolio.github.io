import React from 'react';
import '../styles/components.css';

export function Transport({ isPlaying, onPlayPause, onStop, onClear, bpm, setBpm }) {
    return (
        <div className="transport-controls">
            <button
                className={`btn-transport ${isPlaying ? 'active' : ''}`}
                onClick={onPlayPause}
            >
                {isPlaying ? (
                    <>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" width="3" height="12" fill="currentColor" />
                            <rect x="7" width="3" height="12" fill="currentColor" />
                        </svg>
                        Pause
                    </>
                ) : (
                    <>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 0.5V11.5L11 6L2.5 0.5Z" fill="currentColor" />
                        </svg>
                        Play
                    </>
                )}
            </button>

            <button className="btn-transport" onClick={onStop}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="12" height="12" fill="currentColor" />
                </svg>
                Stop
            </button>

            <button className="btn-transport" onClick={onClear}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 2.5L2.5 9.5M2.5 2.5L9.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Clear
            </button>

            <div className="tempo-control">
                <span className="tempo-label">Tempo</span>
                <input
                    type="range"
                    min="60"
                    max="180"
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value))}
                    className="slider"
                />
                <span className="tempo-value">{bpm} BPM</span>
            </div>
        </div>
    );
}
