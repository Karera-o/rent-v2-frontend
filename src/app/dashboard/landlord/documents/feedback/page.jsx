"use client";

import dynamic from 'next/dynamic';

// Dynamically import the feedback demo component to avoid SSR issues
const FeedbackDemo = dynamic(
  () => import('../feedback-demo'),
  { ssr: false }
);

export default function FeedbackDemoPage() {
  return <FeedbackDemo />;
}
