'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { ProjectAnalyticsChart } from '@/components/ProjectAnalyticsChart';
import { Reminders } from '@/components/Reminders';
import { fetchProjects } from '@/lib/api';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch projects from backend
        // For now we might not have data, so we can gracefully fail or mock if empty
        const data = await fetchProjects().catch(err => {
          console.error("Failed to fetch projects, using defaults", err);
          return [];
        });
        setProjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-gray-500">Plan, prioritize, and accomplish your tasks with ease.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search task"
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64 text-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
              {/* Avatar */}
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jessin" alt="User" />
            </div>
            <div className="text-sm hidden md:block">
              <p className="font-bold text-gray-900">Jessin Sam</p>
              <p className="text-gray-500 text-xs">jessin@gmail.com</p>
            </div>
          </div>
        </header>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button className="bg-[#005f2f] hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-medium border border-gray-200 transition-colors">
            Import Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* We can use real data here if available, mapping from 'projects' state */}
          <StatCard title="Total Projects" value="24" status="Increased from last month" />
          <StatCard title="Ended Projects" value="10" status="Increased from last month" />
          <StatCard title="Running Projects" value="12" status="Increased from last month" />
          <StatCard title="Pending Project" value="2" status="On Discuss" isPositive={false} />
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProjectAnalyticsChart />
          </div>
          <div>
            <Reminders />
          </div>
        </div>
      </main>
    </div>
  );
}
