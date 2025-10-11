// app/user-home/loading.tsx
"use client";
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <svg width="60" height="60" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" strokeDasharray="60 120"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"></animateTransform></circle></svg>
    </div>
  );
}