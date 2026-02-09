'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

// Use environment variable for API base URL, fallback to localhost for local development
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// Debug: Log the API base URL
if (typeof window !== 'undefined') {
    console.log('API Test Page - API Base URL:', API_BASE);
    console.log('API Test Page - Environment variable:', process.env.NEXT_PUBLIC_API_BASE_URL);
}

type Endpoint = 'projects' | 'rewards';

export default function ApiTestPage() {
    const [activeTab, setActiveTab] = useState<Endpoint>('projects');
    const [response, setResponse] = useState<string>('No response yet');
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [listData, setListData] = useState<any[]>([]);

    // Form states
    const [id, setId] = useState('');
    const [payload, setPayload] = useState('');

    const clear = () => {
        setResponse('No response yet');
        setStatus('');
        setId('');
        setPayload('');
        setListData([]);
    };

    const getTemplate = (type: Endpoint) => {
        if (type === 'projects') {
            return JSON.stringify({
                name: "New Project",
                status: "Running",
                type: "Web App",
                progress: 0
            }, null, 2);
        } else {
            return JSON.stringify({
                userId: "user-123",
                points: 100,
                description: "Bonus points"
            }, null, 2);
        }
    };

    const execute = async (method: string, path: string, body?: any) => {
        setLoading(true);
        setResponse('Loading...');
        setStatus('');

        try {
            const options: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (body && (method === 'POST' || method === 'PUT')) {
                options.body = body;
            }

            const res = await fetch(`${API_BASE}${path}`, options);
            setStatus(`${res.status} ${res.statusText}`);

            const text = await res.text();
            try {
                const json = JSON.parse(text);
                setResponse(JSON.stringify(json, null, 2));

                // Update list if GET ALL was called
                if (method === 'GET' && path === `/${activeTab}`) {
                    if (Array.isArray(json)) {
                        setListData(json);
                    }
                }
            } catch {
                setResponse(text || 'No content');
            }
        } catch (err: any) {
            setStatus('Error');
            setResponse(err.message);
        } finally {
            setLoading(false);
        }
    };

    const selectItem = (item: any) => {
        setId(item.id);
        const { id, ...rest } = item;
        setPayload(JSON.stringify(rest, null, 2));
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">API Tester</h1>

                <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => { setActiveTab('projects'); clear(); setPayload(getTemplate('projects')); }}
                        className={`px-4 py-2 font-medium ${activeTab === 'projects' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'}`}
                    >
                        Projects API
                    </button>
                    <button
                        onClick={() => { setActiveTab('rewards'); clear(); setPayload(getTemplate('rewards')); }}
                        className={`px-4 py-2 font-medium ${activeTab === 'rewards' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'}`}
                    >
                        Rewards API
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Operations</h3>

                            <div className="space-y-4">
                                {/* GET ALL */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-mono text-sm">GET /{activeTab}</span>
                                    <button
                                        onClick={() => execute('GET', `/${activeTab}`)}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200"
                                    >
                                        Execute & List
                                    </button>
                                </div>

                                {/* List View for Selection */}
                                {listData.length > 0 && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <label className="text-xs text-gray-500 mb-2 block">Select an item to populate ID for Update/Delete:</label>
                                        <select
                                            className="w-full p-2 text-sm border rounded bg-white"
                                            onChange={(e) => {
                                                const item = listData.find(i => i.id === e.target.value);
                                                if (item) selectItem(item);
                                            }}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select an item...</option>
                                            {listData.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.id} - {item.name || item.description || 'Item'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* GET BY ID */}
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <span className="font-mono text-sm w-16">GET</span>
                                    <input
                                        type="text"
                                        placeholder="ID"
                                        value={id}
                                        onChange={(e) => setId(e.target.value)}
                                        className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                                    />
                                    <button
                                        onClick={() => execute('GET', `/${activeTab}/${id}`)}
                                        disabled={!id}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 disabled:opacity-50"
                                    >
                                        Execute
                                    </button>
                                </div>

                                {/* POST */}
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-mono text-sm">POST /{activeTab}</span>
                                        <button
                                            onClick={() => execute('POST', `/${activeTab}`, payload)}
                                            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200"
                                        >
                                            Execute
                                        </button>
                                    </div>
                                    <textarea
                                        value={payload || getTemplate(activeTab)}
                                        onChange={(e) => setPayload(e.target.value)}
                                        className="w-full h-24 p-2 text-xs font-mono border rounded"
                                    />
                                </div>

                                {/* PUT */}
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between mb-2 gap-2">
                                        <span className="font-mono text-sm self-center">PUT .../{id || '{id}'}</span>
                                        <button
                                            onClick={() => execute('PUT', `/${activeTab}/${id}`, payload)}
                                            disabled={!id}
                                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm font-medium hover:bg-orange-200 disabled:opacity-50"
                                        >
                                            Execute
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">Payload above will be used</p>
                                </div>

                                {/* DELETE */}
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <span className="font-mono text-sm w-16">DELETE</span>
                                    <input
                                        type="text"
                                        placeholder="ID"
                                        value={id}
                                        onChange={(e) => setId(e.target.value)}
                                        className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                                    />
                                    <button
                                        onClick={() => execute('DELETE', `/${activeTab}/${id}`)}
                                        disabled={!id}
                                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                                    >
                                        Execute
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="bg-slate-900 rounded-xl shadow-lg overflow-hidden flex flex-col h-[600px]">
                        <div className="px-4 py-2 bg-slate-800 flex justify-between items-center border-b border-slate-700">
                            <span className="text-gray-400 text-xs font-mono">Response Output</span>
                            {status && (
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${status.startsWith('2') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                                    {status}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap">
                                {response}
                            </pre>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
