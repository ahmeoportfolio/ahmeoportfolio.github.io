import { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../audio/AudioEngine';

const LOOKAHEAD = 25.0; // ms
const SCHEDULE_AHEAD_TIME = 0.1; // s

export function useSequencer({ bpm, grid, setHighlightStep }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const nextNoteTimeRef = useRef(0);
    const currentStepRef = useRef(0);
    const timerIDRef = useRef(null);

    // Play/Pause handler
    const togglePlay = () => {
        if (isPlaying) {
            setIsPlaying(false);
            if (timerIDRef.current) clearTimeout(timerIDRef.current);
            setHighlightStep(-1);
        } else {
            audioEngine.resume();
            // Start slightly in the future to avoid immediate catch-up glitches
            nextNoteTimeRef.current = audioEngine.ctx.currentTime + 0.1;
            currentStepRef.current = 0;
            setIsPlaying(true);
            scheduler();
        }
    };

    const scheduler = () => {
        // while there are notes that will need to play before the next interval,
        // schedule them and advance the pointer.
        while (nextNoteTimeRef.current < audioEngine.ctx.currentTime + SCHEDULE_AHEAD_TIME) {
            scheduleNote(currentStepRef.current, nextNoteTimeRef.current);
            nextNote();
        }
        timerIDRef.current = setTimeout(scheduler, LOOKAHEAD);
    };

    const nextNote = () => {
        const secondsPerBeat = 60.0 / bpm;
        // 16th notes = 0.25 of a beat
        nextNoteTimeRef.current += 0.25 * secondsPerBeat;

        currentStepRef.current = (currentStepRef.current + 1) % 16;
    };

    const scheduleNote = (beatNumber, time) => {
        // 1. Audio Scheduling
        // Check grid at this beatNumber for each instrument
        // grid structure: { kick: [bool...], snare: [bool...] } ? 
        // Or array of instruments? 
        // Let's assume grid is an object of arrays for now, passed from parent.

        // We will pass the callback to the parent to play sounds, or do it here?
        // Doing it here is tighter.

        // Let's verify grid is populated
        if (grid) {
            if (grid.kick && grid.kick[beatNumber]) audioEngine.playKick(time);
            if (grid.snare && grid.snare[beatNumber]) audioEngine.playSnare(time);
            if (grid.hihat && grid.hihat[beatNumber]) audioEngine.playHiHat(time);
            if (grid.openhat && grid.openhat[beatNumber]) audioEngine.playOpenHat(time);
            if (grid.clap && grid.clap[beatNumber]) audioEngine.playClap(time);
        }

        // 2. UI Scheduling
        // We want the UI to highlight exactly when the note plays.
        // AudioContext time is different from JS time, but we can do a diff.
        const drawTime = (time - audioEngine.ctx.currentTime); // in seconds

        // Use the callback to update UI
        // We check if component is still mounted/playing in the timeout?
        // It's a detached closure, so we need to be careful.
        // Actually, just pushing to a rect queue or using a timeout is standard.

        setTimeout(() => {
            setHighlightStep(beatNumber);
        }, Math.max(0, drawTime * 1000));
    };

    // Stop function
    const stop = () => {
        setIsPlaying(false);
        if (timerIDRef.current) clearTimeout(timerIDRef.current);
        currentStepRef.current = 0;
        setHighlightStep(0); // Reset to start
    };

    // Clear function is just data manipulation, handled by parent.

    useEffect(() => {
        return () => {
            if (timerIDRef.current) clearTimeout(timerIDRef.current);
        }
    }, []);

    return {
        isPlaying,
        togglePlay,
        stop
    };
}
