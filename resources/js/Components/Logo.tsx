import React from 'react';

const Logo: React.FC<{ size?: number }> = ({ size = 40 }) => (
    <div className="logo-wrapper overflow-visible flex items-center justify-center">
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="logo-svg"
        >
            <defs>
                <linearGradient id="logo-grad-cookie" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d2963d" />
                    <stop offset="100%" stopColor="#8d5b1b" />
                </linearGradient>
                <filter id="logo-shadow-cookie">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.2" />
                </filter>
            </defs>
            
            {/* The Cookie Body (Slightly irregular circle for artisanal look) */}
            <path 
                d="M50 8C26.8 8 8 26.8 8 50C8 73.2 26.8 92 50 92C73.2 92 92 73.2 92 50C92 26.8 73.2 8 50 8Z" 
                fill="url(#logo-grad-cookie)" 
                filter="url(#logo-shadow-cookie)"
                className="logo-base"
            />
            
            {/* Chocolate Chips */}
            <circle cx="30" cy="25" r="4" fill="#4a2c0f" fillOpacity="0.8" />
            <circle cx="75" cy="35" r="5" fill="#4a2c0f" fillOpacity="0.8" />
            <circle cx="25" cy="65" r="5" fill="#4a2c0f" fillOpacity="0.8" />
            <circle cx="70" cy="75" r="4" fill="#4a2c0f" fillOpacity="0.8" />
            <circle cx="50" cy="85" r="3" fill="#4a2c0f" fillOpacity="0.8" />
            <circle cx="15" cy="45" r="3" fill="#4a2c0f" fillOpacity="0.8" />

            {/* The 'k' text (Monogram) */}
            <text 
                x="50" 
                y="62" 
                fill="white" 
                fontSize="50" 
                fontWeight="900" 
                textAnchor="middle" 
                fontFamily="Georgia, serif"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                className="logo-text"
            >
                k
            </text>

            {/* Subtle Texture / Cracks */}
            <path d="M40 15Q45 18 50 15" stroke="white" strokeOpacity="0.1" strokeWidth="1" fill="none" />
            <path d="M15 60Q20 65 15 70" stroke="white" strokeOpacity="0.1" strokeWidth="1" fill="none" />
            <path d="M80 50Q85 55 80 60" stroke="white" strokeOpacity="0.1" strokeWidth="1" fill="none" />
        </svg>
    </div>
);

export default Logo;

