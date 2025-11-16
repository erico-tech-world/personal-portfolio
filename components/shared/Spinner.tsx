import React from 'react';

const Spinner = ({ size = 'h-8 w-8' }: { size?: string }) => {
    return (
        <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 border-accent-cyan`}></div>
    );
};

export default Spinner;
