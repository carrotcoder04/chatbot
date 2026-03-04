/**
 * PtitIcon — Custom SVG icon for PTIT Chatbot
 * A stylized "P" with signal/wave lines, representing PTIT's telecom identity.
 */
export function PtitIcon({
    size = 24,
    color = "#C41E22",
}: {
    size?: number;
    color?: string;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="PTIT Chatbot"
        >
            {/* Outer circle ring */}
            <circle cx="16" cy="16" r="14.5" stroke={color} strokeWidth="1.2" strokeOpacity="0.35" />

            {/* Signal arc — top right */}
            <path
                d="M22 7.5 C 25.5 10 27 13 27 16"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.6"
                fill="none"
            />
            {/* Signal arc — smaller */}
            <path
                d="M20.5 9.5 C 23 11.5 24 13.5 24 16"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.9"
                fill="none"
            />

            {/* Stylized bold "P" */}
            <text
                x="8"
                y="22"
                fontFamily="'Arial', sans-serif"
                fontSize="17"
                fontWeight="800"
                fill={color}
                letterSpacing="-0.5"
            >
                P
            </text>

            {/* Dot accent — bottom right */}
            <circle cx="23.5" cy="22.5" r="2" fill={color} fillOpacity="0.85" />
        </svg>
    );
}
