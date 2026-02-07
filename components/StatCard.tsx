export function StatCard({ title, value, status, iconColor = "green", isPositive = true }: { title: string, value: string | number, status: string, iconColor?: string, isPositive?: boolean }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-md transition-shadow">
            {/* Background decoration */}
            {title === "Total Projects" && (
                <div className="absolute inset-0 bg-[#005f2f] z-0"></div>
            )}

            <div className={`flex justify-between items-start z-10 ${title === "Total Projects" ? "text-white" : ""}`}>
                <h3 className={`text-sm font-medium ${title === "Total Projects" ? "text-gray-100" : "text-gray-500"}`}>{title}</h3>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${title === "Total Projects" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </div>
            </div>

            <div className={`z-10 ${title === "Total Projects" ? "text-white" : ""}`}>
                <div className="text-4xl font-bold mb-2">{value}</div>
                <div className={`text-xs flex items-center gap-1 ${title === "Total Projects" ? "text-gray-200" : "text-gray-500"}`}>
                    {isPositive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    ) : null}
                    <span>{status}</span>
                </div>
            </div>
        </div>
    );
}
