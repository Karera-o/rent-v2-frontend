"use client";

import Link from 'next/link';
import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gray-100 rounded-full">
              <WifiOff className="h-12 w-12 text-[#111827]" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">You're offline</h1>

          <p className="text-gray-600 mb-6">
            It seems you're not connected to the internet. Please check your connection and try again.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-[#111827] hover:bg-[#1f2937]"
            >
              Try Again
            </Button>

            <Link href="/" passHref>
              <Button variant="outline" className="w-full">
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Clickit & Getin - Find your perfect home
        </p>
      </div>
    </div>
  );
}
