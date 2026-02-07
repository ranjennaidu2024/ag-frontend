export function Reminders() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="font-bold text-lg text-gray-800 mb-6">Reminders</h3>

            <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-sm text-gray-800">Meeting with Arc Company</h4>
                        <p className="text-xs text-gray-500 mt-1">Time: 02.00 pm - 04.00 pm</p>
                    </div>
                    {/* User Avatar Placeholder */}
                </div>

                <button className="w-full mt-3 bg-[#005f2f] hover:bg-emerald-800 text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Start Meeting
                </button>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 opacity-50">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-sm text-gray-800">Team Sync</h4>
                        <p className="text-xs text-gray-500 mt-1">Time: 05.00 pm - 06.00 pm</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
