"use client";

import { Bell, Search } from "lucide-react";

export default function UserHeader() {
  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="px-4 h-full flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <div className="max-w-lg w-full lg:max-w-xs">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="Search properties..."
                type="search"
              />
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}