import React from 'react';
import {
  Shield,
  Briefcase,
  BookOpen,
  ChevronRight,
  UserCheck,
  UserPlus,
  HeartPulse
} from 'lucide-react';

interface LandingViewProps {
  onLaunch: () => void;
  onRegister: () => void;
  onLogin: () => void;
  onNavigateToNews: () => void;
  onNavigateToFleets: () => void;
  onNavigateToRights: () => void;
  onNavigateToHardship: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({
  onRegister,
  onLogin,
  onNavigateToFleets,
  onNavigateToRights,
  onNavigateToHardship,
}) => {
  return (
    <div className="h-full bg-slate-950 text-white flex flex-col items-center overflow-y-auto no-scrollbar animate-fade-in relative">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[radial-gradient(circle_at_50%_0%,rgba(51,65,85,0.3)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-md w-full px-8 py-20 space-y-16 relative z-10">

        {/* Branding */}
        <div className="text-center space-y-10">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-slate-400 blur-[40px] rounded-full opacity-20 animate-pulse"></div>
              <div className="relative p-6">
                <Shield className="w-20 h-20 text-slate-400" strokeWidth={1} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-black uppercase italic tracking-tighter text-slate-100 leading-none drop-shadow-2xl">
              TOWGUARD24
            </h1>

            <div className="flex flex-col items-center">
              <div className="h-[1px] w-16 bg-slate-800 mb-4"></div>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.8em] text-center leading-loose">
                YOUR ROADSIDE DIGITAL SHIELD
              </p>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="space-y-6">
          <button
            onClick={onRegister}
            className="w-full py-8 bg-[#fcd5c5] text-[#7c2d12] rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_-12px_rgba(253,213,197,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-[#fb923c]/40"
          >
            <UserPlus className="w-5 h-5 opacity-60" /> CREATE ACCOUNT
          </button>

          <button
            onClick={onLogin}
            className="w-full py-6 bg-white/5 border border-white/10 text-slate-200 rounded-[2.5rem] text-[9px] font-black uppercase tracking-[0.4em] active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-white/10"
          >
            <UserCheck className="w-4 h-4 text-slate-400" /> LOG IN
          </button>
        </div>

        {/* Navigation Tiles */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onNavigateToFleets}
            className="p-7 bg-white/5 border border-white/5 rounded-[2rem] flex flex-col items-center gap-2 hover:bg-white/10 transition-all group"
          >
            <Briefcase className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-200">
              Business Ops
            </span>
          </button>

          <button
            onClick={onNavigateToRights}
            className="p-7 bg-white/5 border border-white/5 rounded-[2rem] flex flex-col items-center gap-2 hover:bg-white/10 transition-all group"
          >
            <BookOpen className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-200">
              Legal Hub
            </span>
          </button>
        </div>

        {/* Hardship Hub */}
        <button
          onClick={onNavigateToHardship}
          className="w-full p-8 bg-blue-900/10 border border-blue-500/20 rounded-[2.5rem] flex items-center justify-between group active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 border border-white/5 rounded-2xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <HeartPulse className="w-6 h-6 text-blue-500 group-hover:text-white" />
            </div>

            <div className="text-left">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">
                Financial Hardship?
              </h4>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                Public Service Directory
              </p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-blue-400" />
        </button>

        {/* Footer */}
        <div className="pt-10 pb-8 text-center border-t border-white/5">
          <div className="flex justify-center gap-4 mb-4 opacity-10">
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          </div>

          <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.5em]">
            TOWGUARD 24 • SYSTEMS CORP
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
