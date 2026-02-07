export function ProjectAnalyticsChart() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-800">Project Analytics</h3>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs text-gray-500">Weekly Activity</span>
                </div>
            </div>

            <div className="flex-1 flex items-end justify-between px-4 pb-2 gap-4">
                {[30, 45, 25, 60, 80, 50, 40, 70, 35, 55, 65, 90, 45, 60].map((h, i) => (
                    <div key={i} className="w-full bg-emerald-50 rounded-t-sm relative group h-full flex items-end">
                        <div
                            className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all duration-300"
                            style={{ height: `${h}%` }}
                        ></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 font-medium px-4 pt-2 border-t border-gray-50">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
            </div>
        </div>
    );
}
