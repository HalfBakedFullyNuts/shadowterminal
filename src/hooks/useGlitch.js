import { useState, useCallback, useRef } from 'react';

// Global timestamp to track last glitch across all components
let lastGlobalGlitchTime = 0;
const GLITCH_COOLDOWN = 120000; // 2 minutes in milliseconds

/**
 * Hook for rare glitch effect on hover/button press
 * Triggers at most once every 2 minutes globally
 * Returns: { isGlitching, triggerGlitch, glitchClass }
 */
export function useGlitch() {
    const [isGlitching, setIsGlitching] = useState(false);
    const glitchTimeoutRef = useRef(null);

    const triggerGlitch = useCallback(() => {
        const now = Date.now();

        // Check if cooldown has passed
        if (now - lastGlobalGlitchTime < GLITCH_COOLDOWN) {
            return false;
        }

        // Random chance (10% chance when triggered)
        if (Math.random() > 0.1) {
            return false;
        }

        // Update global timestamp
        lastGlobalGlitchTime = now;

        // Activate glitch
        setIsGlitching(true);

        // Clear any existing timeout
        if (glitchTimeoutRef.current) {
            clearTimeout(glitchTimeoutRef.current);
        }

        // Glitch duration between 150-400ms
        const duration = 150 + Math.random() * 250;
        glitchTimeoutRef.current = setTimeout(() => {
            setIsGlitching(false);
        }, duration);

        return true;
    }, []);

    // CSS class to apply when glitching
    const glitchClass = isGlitching
        ? 'animate-glitch skew-x-1 hue-rotate-90 brightness-125'
        : '';

    return { isGlitching, triggerGlitch, glitchClass };
}

/**
 * Wrapper for hover/click events that may trigger glitch
 */
export function useGlitchEvent(callback) {
    const { isGlitching, triggerGlitch, glitchClass } = useGlitch();

    const handleEvent = useCallback((e) => {
        triggerGlitch();
        if (callback) callback(e);
    }, [triggerGlitch, callback]);

    return { handleEvent, isGlitching, glitchClass };
}

export default useGlitch;
