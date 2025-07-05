import Link from 'next/link';
import { Revenue } from "@/features/revenue/components/Revenue";

export default function RevenuePage() {
  return (
    <div className="w-full h-screen bg-black relative">
      {/* Go Back Button */}
      <Link 
        href="/home" 
        className="absolute top-6 left-6 z-50 opacity-0 animate-fade-in-up" 
        style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
      >
        <button className="bg-gradient-to-r from-[#C200FB] via-[#3772FF] to-[#5AC4BE] p-[1px] rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="bg-[#060010] rounded-lg px-4 py-2 text-white font-semibold hover:bg-[#060010]/90 transition-colors">
            ← Go Back
          </div>
        </button>
      </Link>

      <Revenue />
    </div>
  );
} 