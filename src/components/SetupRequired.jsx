import React from 'react';

const SetupRequired = () => {
    return (
        <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center p-4">
            <div className="max-w-2xl w-full border border-green-500 p-8 rounded shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <h1 className="text-3xl font-bold mb-6 text-center glitch-text">SYSTEM ERROR: CONFIGURATION MISSING</h1>

                <div className="space-y-4 text-lg">
                    <p className="border-l-4 border-red-500 pl-4 py-2 bg-red-900/20">
                        CRITICAL FAILURE: Firebase configuration not detected.
                    </p>

                    <p>
                        The Shadowterminal requires a connection to the Matrix (Firebase) to function.
                    </p>

                    <div className="bg-gray-900 p-4 rounded border border-gray-700 mt-6">
                        <h2 className="text-xl font-bold mb-2 text-white">Action Required:</h2>
                        <ol className="list-decimal list-inside space-y-2 text-gray-300">
                            <li>Open the <code className="bg-gray-800 px-1 py-0.5 rounded text-yellow-400">.env</code> file in the project root.</li>
                            <li>Fill in the required Firebase configuration values:
                                <ul className="list-disc list-inside ml-6 mt-2 text-sm text-gray-400 font-mono">
                                    <li>VITE_FIREBASE_API_KEY</li>
                                    <li>VITE_FIREBASE_AUTH_DOMAIN</li>
                                    <li>VITE_FIREBASE_PROJECT_ID</li>
                                    <li>VITE_FIREBASE_STORAGE_BUCKET</li>
                                    <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
                                    <li>VITE_FIREBASE_APP_ID</li>
                                </ul>
                            </li>
                            <li>Restart the application.</li>
                        </ol>
                    </div>

                    <p className="text-sm text-gray-500 mt-8 text-center">
                        [ SYSTEM HALTED ]
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SetupRequired;
