import React, { useState } from 'react';
import './CyberButton.css';

const CyberButton = ({ children, tag = 'R25', className = '', ...props }) => {
    const [glitchStyle, setGlitchStyle] = useState({});

    const handleMouseEnter = (e) => {
        if (props.onMouseEnter) props.onMouseEnter(e);

        if (props.disabled) {
            setGlitchStyle({ display: 'none' });
            return;
        }

        const shouldGlitch = Math.random() > 0.5;

        if (shouldGlitch) {
            // Random speed (animation-duration) between ~0.2s and 2s
            const speedFactor = 0.1 + (Math.random() * 0.9);
            const speed = 2 * speedFactor; // seconds

            // Random total lifespan up to 2.34s
            const maxLifespan = 2.34;
            const lifespan = 0.1 + (Math.random() * (maxLifespan - 0.1));

            // Calculate how many times the animation should loop to fit the lifespan
            const iterations = lifespan / speed;

            setGlitchStyle({
                display: 'block',
                animationDuration: `${speed.toFixed(2)}s`,
                animationIterationCount: iterations.toFixed(2)
            });
        } else {
            setGlitchStyle({ display: 'none' });
        }
    };

    const handleMouseLeave = (e) => {
        if (props.onMouseLeave) props.onMouseLeave(e);
        setGlitchStyle({});
    };

    return (
        <button
            className={`cybr-btn ${className}`}
            {...props}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <span aria-hidden>_</span>
            <span aria-hidden className="cybr-btn__glitch" style={glitchStyle}>{children}_</span>
            <span aria-hidden className="cybr-btn__tag">{tag}</span>
        </button>
    );
};

export default CyberButton;
