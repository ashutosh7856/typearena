import React from 'react';

const Card = ({ children, className = '', hoverEffect = false, ...props }) => {
    return (
        <div
            className={`
        relative bg-[#0f172a]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8
        ${hoverEffect ? 'hover:border-primary/30 transition-colors duration-500 group' : ''}
        ${className}
      `}
            {...props}
        >
            {hoverEffect && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Card;
