import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { Transport } from './components/Transport';
import { Sequencer } from './components/Sequencer';
import { useSequencer } from './hooks/useSequencer';
import { generateBeat } from './utils/beatGenerator';
import { audioEngine } from './audio/AudioEngine';
import './index.css';

const INITIAL_GRID = {
  kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
  hihat: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
  openhat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  clap: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
};

function App() {
  const [grid, setGrid] = useState(INITIAL_GRID);
  const [bpm, setBpm] = useState(120);
  const [highlightStep, setHighlightStep] = useState(-1);

  // Custom hook for sequencer logic
  const { isPlaying, togglePlay, stop } = useSequencer({
    bpm,
    grid,
    setHighlightStep
  });

  const handleToggleStep = useCallback((instrument, index) => {
    setGrid(prev => ({
      ...prev,
      [instrument]: prev[instrument].map((active, i) => i === index ? !active : active)
    }));
  }, []);

  const handleGenerate = (prompt) => {
    const newGrid = generateBeat(prompt);
    setGrid(newGrid);
  };

  const handleSampleUpload = async (instrument, file) => {
    if (!file) return;
    const success = await audioEngine.loadSample(instrument, file);
    if (success) {
      alert(`Loaded custom sound for ${instrument}!`);
    } else {
      alert(`Failed to load sound for ${instrument}`);
    }
  };

  const handleClear = () => {
    setGrid({
      kick: Array(16).fill(false),
      snare: Array(16).fill(false),
      hihat: Array(16).fill(false),
      openhat: Array(16).fill(false),
      clap: Array(16).fill(false),
    });
  };

  return (
    <div className="app-container" style={{ width: '100%', maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <Header />

      <main style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', padding: '2rem' }}>
        <PromptInput onGenerate={handleGenerate} />

        <Transport
          isPlaying={isPlaying}
          onPlayPause={togglePlay}
          onStop={stop}
          onClear={handleClear}
          bpm={bpm}
          setBpm={setBpm}
        />

        <Sequencer
          grid={grid}
          onToggle={handleToggleStep}
          currentStep={highlightStep}
          isPlaying={isPlaying}
          onUpload={handleSampleUpload}
        />

      </main>

      <footer style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        Developed by Ahmed | Rhythm Machine
      </footer>
    </div>
  );
}

export default App;
