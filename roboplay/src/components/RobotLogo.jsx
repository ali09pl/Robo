export const RobotLogo = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeClasses[size]} inline-block`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head (Circle) */}
      <circle cx="50" cy="35" r="25" stroke="#3498db" strokeWidth="2" fill="#e8f4f8" />
      
      {/* Eyes (Stars) */}
      {/* Left Eye */}
      <g transform="translate(40, 30)">
        <polygon
          points="0,-5 1.5,-1.5 5,-1.5 2.5,1.5 3.5,5 0,2 -3.5,5 -2.5,1.5 -5,-1.5 -1.5,-1.5"
          fill="#f1c40f"
        />
      </g>
      
      {/* Right Eye */}
      <g transform="translate(60, 30)">
        <polygon
          points="0,-5 1.5,-1.5 5,-1.5 2.5,1.5 3.5,5 0,2 -3.5,5 -2.5,1.5 -5,-1.5 -1.5,-1.5"
          fill="#f1c40f"
        />
      </g>
      
      {/* Mouth (Smile) */}
      <path
        d="M 40 45 Q 50 50 60 45"
        stroke="#e67e22"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Body (Square) */}
      <rect x="30" y="60" width="40" height="25" stroke="#3498db" strokeWidth="2" fill="#e8f4f8" />
      
      {/* Arms */}
      <rect x="15" y="68" width="15" height="8" stroke="#e67e22" strokeWidth="2" fill="#ffe8cc" rx="4" />
      <rect x="70" y="68" width="15" height="8" stroke="#e67e22" strokeWidth="2" fill="#ffe8cc" rx="4" />
      
      {/* Legs */}
      <rect x="35" y="85" width="8" height="12" stroke="#2ecc71" strokeWidth="2" fill="#d5f4e6" rx="2" />
      <rect x="57" y="85" width="8" height="12" stroke="#2ecc71" strokeWidth="2" fill="#d5f4e6" rx="2" />
      
      {/* Antenna */}
      <line x1="50" y1="10" x2="50" y2="0" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="0" r="2" fill="#e74c3c" />
    </svg>
  );
};
