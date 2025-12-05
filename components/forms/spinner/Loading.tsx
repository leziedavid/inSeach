
export function Loading() {
    return (
        <>
            <div className="flex justify-center items-center">
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="animate-spin"
                >
                    <path
                        d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12"
                        stroke="#b07b5e"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="1, 10"
                    />
                    <path
                        d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C4.00035 5.85752 3.26375 6.95991 2.7612 8.17317C2.25866 9.38642 2 10.6868 2 12"
                        stroke="#b07b5e"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeOpacity="0.3"
                    />
                </svg>
            </div>
            <span>Recherche en cours…</span>
        </>
    )
}