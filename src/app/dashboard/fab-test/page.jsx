import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import NextDynamic from 'next/dynamic';

// Force this page to be dynamically rendered
export const dynamic = 'force-dynamic';

// Dynamically import the client component with no SSR
const FabTestContent = NextDynamic(() => import('./FabTestContent'), {
  ssr: false,
  loading: () => <div className="p-4">Loading test page...</div>
});

export default function FabTestPage() {
  return (
    <div className="container-responsive py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <Suspense fallback={<div className="p-4">Loading test page...</div>}>
        <FabTestContent />
      </Suspense>
    </div>
  );
}
