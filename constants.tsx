import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="0.5" floodColor="#000000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#shadow)">
            {children}
        </g>
    </svg>
);

export const PlayIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    </IconWrapper>
);

export const PauseIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
     <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const StopIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
     <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9h6v6H9z" />
    </IconWrapper>
);

export const PlusIcon: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </IconWrapper>
);

export const TrashIcon: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
     <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </IconWrapper>
);

export const BellIcon: React.FC<{className?: string}> = ({ className = "w-4 h-4" }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </IconWrapper>
);

export const SunIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
    <IconWrapper className={className}>
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </IconWrapper>
);

export const MoonIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </IconWrapper>
);

export const AlertIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
     <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </IconWrapper>
);
