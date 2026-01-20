import React, { useEffect, useState } from 'react';

const CURRENT_VERSION_CODE = 2; // এই নাম্বারটি অ্যাপ আপডেট করলে বাড়িয়ে দিবেন
const UPDATE_JSON_URL = "https://raw.githubusercontent.com/nayem-48ai/Sikkha-48/main/update.json";

const UpdateChecker: React.FC = () => {
    const [updateData, setUpdateData] = useState<any>(null);

    useEffect(() => {
        const checkUpdate = async () => {
            try {
                const response = await fetch(UPDATE_JSON_URL);
                const data = await response.json();
                if (data.versionCode > CURRENT_VERSION_CODE) {
                    setUpdateData(data);
                }
            } catch (error) {
                console.log("Update check failed (Offline or URL issue)");
            }
        };
        checkUpdate();
    }, []);

    if (!updateData) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="text-center">
                    <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">আপডেট পাওয়া গেছে!</h2>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        ভার্সন: <span className="font-bold text-indigo-600">{updateData.versionName}</span> <br/>
                        {updateData.message}
                    </p>
                    
                    <button 
                        onClick={() => window.location.href = updateData.updateUrl}
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200"
                    >
                        এখনই আপডেট করুন
                    </button>
                    
                    {!updateData.forceUpdate && (
                        <button 
                            onClick={() => setUpdateData(null)}
                            className="w-full mt-2 text-gray-400 text-xs font-medium py-2"
                        >
                            পরে করবো
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateChecker;

