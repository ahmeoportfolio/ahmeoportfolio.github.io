export function generateBeat(prompt) {
    const p = prompt.toLowerCase();

    // Default empty grid
    const grid = {
        kick: Array(16).fill(false),
        snare: Array(16).fill(false),
        hihat: Array(16).fill(false),
        openhat: Array(16).fill(false),
        clap: Array(16).fill(false),
    };

    const fill = (inst, steps) => {
        steps.forEach(s => {
            if (s >= 0 && s < 16) grid[inst][s] = true;
        });
    };

    if (p.includes('techno') || p.includes('minimal')) {
        fill('kick', [0, 4, 8, 12]);
        fill('hihat', [2, 6, 10, 14]);
        fill('openhat', [10]);
        fill('snare', []); // often sparse
        if (p.includes('minimal')) {
            fill('clap', [4, 12]);
        }
    } else if (p.includes('house')) {
        fill('kick', [0, 4, 8, 12]);
        fill('clap', [4, 12]);
        fill('hihat', [2, 6, 10, 14]);
        fill('openhat', [2, 6, 10, 14]); // Open hats on offbeats
        fill('snare', [4, 12]); // Layered with clap
    } else if (p.includes('trap')) {
        fill('kick', [0, 7, 10]);
        fill('snare', [4, 12]);
        fill('hihat', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]); // Rolling hats
        fill('clap', [4, 12]);
    } else if (p.includes('breakbeat') || p.includes('jungle')) {
        fill('kick', [0, 7, 10]);
        fill('snare', [4, 12, 15]);
        fill('hihat', [0, 2, 4, 6, 8, 10, 12, 14]);
    } else if (p.includes('rock') || p.includes('stadium')) {
        fill('kick', [0, 8, 10]);
        fill('snare', [4, 12]);
        fill('hihat', [0, 2, 4, 6, 8, 10, 12, 14]);
        fill('openhat', [14]);
    } else if (p.includes('cowbell') || p.includes('808')) {
        fill('kick', [0, 3, 8, 11]);
        fill('snare', [4, 12]);
        fill('openhat', [0, 4, 8, 12]); // Cowbell-ish placement usually 4/4
    } else {
        // Default / Random-ish
        fill('kick', [0, 8]);
        fill('snare', [4, 12]);
        fill('hihat', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    }

    return grid;
}
