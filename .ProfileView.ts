import React, { useState, ReactNode, useEffect, ErrorInfo, Component } from 'react';
import { AppView, TowStatus, TowProvider, SubscriptionTier } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';

// View Components
import LandingView from './LandingView';
import OnboardingView from './OnboardingView';
import MapInterface from './MapInterface';
import GuardView from './GuardView';
import ProfileView from './ProfileView';
import NewsView from './NewsView';
import TrackingView from './TrackingView';
import VoiceAssistant from './VoiceAssistant';
import FleetView from './FleetView';
import RightsView from './RightsView';
import VideoGenView from './VideoGenView';
import IntelHubView from './IntelHubView';
import CollisionGuardView from './CollisionGuardView';
import FraudSentryView from './FraudSentryView';
import ReviewView from './ReviewView';
import PacketView from './PacketView';
import LawDirectoryView from './LawDirectoryView';
import BlueprintView from './BlueprintView';
import HardshipHubView from './HardshipHubView';
import SalesView from './SalesView';
import DevPortal from './DevPortal';
import PresentationView from './PresentationView';
import UpgradeView from './UpgradeView';
import FleetControlView from './FleetControlView';
import WalletView from './WalletView';
import ConnectView from './ConnectView';
import HistoryView from './HistoryView';
import LegalView from './LegalView';
import HunterView from './HunterView';
import WorkerView from './WorkerView';
import DisputesView from './DisputesView';

// Icons
import { Map as MapIcon, Shield, User, Newspaper, RefreshCw, AlertTriangle, ShieldCheck, Activity, Crown } from 'lucide-react';

// --- Error Boundary ---
interface ErrorFallbackProps {
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onReset }) => (
  <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center p-10 text-center space-y-6">
    <div className="w-20 h-20 bg-red-950/20 rounded-3xl flex items-center justify-center border border-red-900/30">
      <AlertTriangle className="w-10 h-10 text-red-500" />
    </div>
    <div className="space-y-2">
      <h2 className="text-xl font-black text-slate-200 uppercase italic">Link Failure</h2>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Re-syncing with towguard24.com nodes...</p>
    </div>
    <button onClick={onReset} className="px-6 py-3 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center gap-2">
      <RefreshCw className="w-4 h-4" /> Restart Engine
    </button>
  </div>
);

interface SystemErrorBoundaryProps {
  children?: ReactNode;
}

interface SystemErrorBoundaryState {
  hasError: boolean;
}

class SystemErrorBoundary extends Component<SystemErrorBoundaryProps, SystemErrorBoundaryState> {
  public state: SystemErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() { 
    return { hasError: true }; 
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("SystemErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

// --- Main App Component ---
const App: React.FC = () => {
  const [view, setView] = useState<AppView | 'UPGRADE' | 'FLEET_CONTROL'>(AppView.LANDING);
  const [status, setStatus] = useState<TowStatus>(TowStatus.IDLE);
  const [selectedProvider, setSelectedProvider] = useState<TowProvider | null>(null);
  const [showVoice, setshowVoice] = useState(false);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const { location, status: geoStatus } = useGeolocation();

  useEffect(() => {
    const isRegistered = localStorage.getItem('towguard_user_registered');
    const storedTier = localStorage.getItem('towguard_subscription_tier') as SubscriptionTier;
    if (storedTier) setCurrentTier(storedTier);
    if (isRegistered === 'true') {
      setView(AppView.HOME);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('towguard_user_registered');
    localStorage.removeItem('towguard_user_profile');
    localStorage.removeItem('towguard_subscription_tier');
    setView(AppView.LANDING);
  };

  const handleUpgrade = (tier: SubscriptionTier) => {
    setCurrentTier(tier);
    localStorage.setItem('towguard_subscription_tier', tier);
    setView(AppView.HOME);
  };

  const renderNavbar = () => {
    const navItems = [
      { id: AppView.HOME, icon: MapIcon, label: 'Map' },
      { id: AppView.GUARD, icon: Shield, label: 'Guard' },
      { id: 'UPGRADE', icon: Crown, label: 'Upgrade', highlight: true },
      { id: AppView.NEWS, icon: Newspaper, label: 'News' },
      { id: AppView.PROFILE, icon: User, label: 'Profile' },
    ];

    return (
      <nav className="bg-slate-950 border-t border-white/5 px-6 pt-4 pb-10 flex justify-between items-center shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={`flex flex-col items-center gap-1.5 transition-all min-w-[50px] ${view === item.id ? (item.highlight ? 'text-safety-orange scale-110' : 'text-safety-orange scale-110') : 'text-slate-500 hover:text-slate-200'}`}
          >
            <item.icon className={`w-5 h-5 ${item.highlight && view !== item.id ? 'text-amber-500 animate-pulse' : ''}`} />
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    );
  };

  const renderGlobalHeader = () => {
    if (view === AppView.LANDING || view === AppView.ONBOARDING || view === AppView.PRESENTATION || view === 'UPGRADE') return null;
    
    return (
      <div className="absolute top-0 left-0 right-0 p-4 pt-12 z-[100] pointer-events-none flex justify-between items-center">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-2xl pointer-events-auto">
          <ShieldCheck className="w-4 h-4 text-safety-orange" />
          <div className="text-left">
            <h1 className="text-[10px] font-black text-white uppercase italic leading-none">TowGuard {currentTier}</h1>
            <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Verified Node: NY-Sector</p>
          </div>
        </div>
        
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-2xl pointer-events-auto">
          <Activity className={`w-4 h-4 ${geoStatus === 'LOCKED' ? 'text-green-500' : 'text-yellow-500'}`} />
          <div className="text-left">
            <h1 className="text-[10px] font-black text-white uppercase italic leading-none">Telemetry</h1>
            <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{geoStatus}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (view) {
      case AppView.LANDING:
        return (
          <LandingView 
            onLaunch={() => setView(AppView.HOME)} 
            onRegister={() => setView(AppView.ONBOARDING)} 
            onLogin={() => setView(AppView.ONBOARDING)} 
            onNavigateToNews={() => setView(AppView.NEWS)} 
            onNavigateToFleets={() => setView(AppView.FLEETS)} 
            onNavigateToRights={() => setView(AppView.KNOW_YOUR_RIGHTS)} 
            onNavigateToHardship={() => setView(AppView.HARDSHIP_HUB)}
            onNavigateByIntent={(viewId) => setView(viewId as any)}
          />
        );
      case AppView.ONBOARDING:
        return <OnboardingView onComplete={() => setView(AppView.HOME)} />;
      case 'UPGRADE':
        return <UpgradeView onBack={() => setView(AppView.HOME)} onUpgrade={handleUpgrade} />;
      case 'FLEET_CONTROL':
        return <FleetControlView onBack={() => setView(AppView.PROFILE)} />;
      case AppView.WALLET:
        return <WalletView onBack={() => setView(AppView.PROFILE)} />;
      case AppView.HOME:
        return (
          <div className="h-full flex flex-col bg-slate-950">
            <div className="flex-1 relative overflow-hidden">
              <MapInterface 
                status={status} 
                selectedProvider={selectedProvider} 
                onProviderSelect={(p) => { 
                  setSelectedProvider(p); 
                  setStatus(TowStatus.ACCEPTED); 
                  setView(AppView.TRACKING); 
                }} 
                userLocation={location} 
              />
              <button 
                onClick={() => setshowVoice(true)} 
                className="absolute bottom-12 right-6 p-5 bg-safety-orange rounded-full text-white shadow-[0_0_30px_rgba(255,95,31,0.5)] z-[400] active:scale-95 transition-all"
              >
                <Shield className="w-6 h-6" />
              </button>
            </div>
            {renderNavbar()}
          </div>
        );
      case AppView.GUARD:
        return (
          <div className="h-full flex flex-col bg-slate-950">
            <div className="flex-1 overflow-hidden">
              <GuardView onBack={() => setView(AppView.HOME)} onNavigateToIntel={() => setView(AppView.INTEL)} onNavigateToCollision={() => setView(AppView.COLLISION_GUARD)} onNavigateToFraud={() => setView(AppView.FRAUD_SENTRY)} onNavigateToVideoGen={() => setView(AppView.VIDEO_GEN)} />
            </div>
            {renderNavbar()}
          </div>
        );
      case AppView.SALES:
        return <SalesView />;
      case AppView.PROFILE:
        return (
          <div className="h-full flex flex-col bg-slate-950">
            <div className="flex-1 overflow-hidden">
              <ProfileView 
                onBack={() => setView(AppView.HOME)} 
                onNavigateToDev={() => setView(AppView.DEV_PORTAL)} 
                onNavigateToSales={() => setView(AppView.SALES)} 
                onNavigateToBlueprints={() => setView(AppView.BLUEPRINTS)} 
                onNavigateToReviews={() => setView(AppView.REVIEWS)} 
                onNavigateToPresentation={() => setView(AppView.PRESENTATION)} 
                onNavigateToHunter={() => setView(AppView.HUNTER)}
                onNavigateToWallet={() => setView(AppView.WALLET)}
                onNavigateToDisputes={() => setView(AppView.DISPUTES)}
                onNavigateToWorker={() => setView(AppView.WORKER)}
                onLogout={handleLogout} 
              />
              {currentTier === SubscriptionTier.ENTERPRISE && (
                 <div className="px-8 pb-8 pt-0">
                    <button 
                      onClick={() => setView('FLEET_CONTROL')}
                      className="w-full bg-blue-600 p-6 rounded-[2.5rem] flex items-center justify-between text-white shadow-xl active:scale-95 transition-all"
                    >
                       <div className="flex items-center gap-4">
                          <Building2Icon className="w-6 h-6" />
                          <span className="text-sm font-black uppercase italic">Fleet Control View</span>
                       </div>
                       <ArrowRightIcon className="w-4 h-4" />
                    </button>
                 </div>
              )}
            </div>
            {renderNavbar()}
          </div>
        );
      case AppView.DEV_PORTAL: return <DevPortal onBack={() => setView(AppView.PROFILE)} />;
      case AppView.PRESENTATION: return <PresentationView onBack={() => setView(AppView.PROFILE)} />;
      case AppView.INTEL: return <IntelHubView onBack={() => setView(AppView.GUARD)} />;
      case AppView.COLLISION_GUARD: return <CollisionGuardView onBack={() => setView(AppView.GUARD)} />;
      case AppView.FRAUD_SENTRY: return <FraudSentryView onBack={() => setView(AppView.GUARD)} dispatchedProvider={selectedProvider} />;
      case AppView.NEWS: return <div className="h-full flex flex-col bg-slate-950"><div className="flex-1 overflow-hidden"><NewsView onBack={() => setView(AppView.HOME)} /></div>{renderNavbar()}</div>;
      case AppView.HARDSHIP_HUB: return <div className="h-full flex flex-col bg-slate-950"><div className="flex-1 overflow-hidden"><HardshipHubView onBack={() => setView(AppView.HOME)} /></div>{renderNavbar()}</div>;
      case AppView.TRACKING: return selectedProvider ? <TrackingView provider={selectedProvider} status={status} onCancel={() => setView(AppView.HOME)} onNavigateToPacket={() => setView(AppView.PACKET)} onNavigateToReviews={() => setView(AppView.REVIEWS)} /> : null;
      case AppView.VIDEO_GEN: return <VideoGenView onBack={() => setView(AppView.GUARD)} />;
      case AppView.BLUEPRINTS: return <BlueprintView onBack={() => setView(AppView.PROFILE)} />;
      case AppView.REVIEWS: return <ReviewView onBack={() => setView(AppView.PROFILE)} />;
      case AppView.PACKET: return <PacketView onBack={() => setView(AppView.TRACKING)} />;
      case AppView.FLEETS: return <FleetView onBack={() => setView(AppView.LANDING)} onOnboard={() => setView(AppView.ONBOARDING)} />;
      case AppView.KNOW_YOUR_RIGHTS: return <RightsView onBack={() => setView(AppView.LANDING)} onFindLegal={() => setView(AppView.LAW_FIRMS)} />;
      case AppView.LAW_FIRMS: return <LawDirectoryView onBack={() => setView(AppView.KNOW_YOUR_RIGHTS)} />;
      case AppView.CONNECT: return <ConnectView onBack={() => setView(AppView.HOME)} />;
      case AppView.HISTORY: return <HistoryView onBack={() => setView(AppView.HOME)} />;
      case AppView.LEGAL: return <LegalView onBack={() => setView(AppView.HOME)} />;
      case AppView.HUNTER: return <HunterView onBack={() => setView(AppView.PROFILE)} />;
      case AppView.WORKER: return <WorkerView onBack={() => setView(AppView.PROFILE)} />;
      case AppView.DISPUTES: return <DisputesView onBack={() => setView(AppView.PROFILE)} />;
      default: return <LandingView 
            onLaunch={() => setView(AppView.HOME)} 
            onRegister={() => setView(AppView.ONBOARDING)} 
            onLogin={() => setView(AppView.ONBOARDING)} 
            onNavigateToNews={() => setView(AppView.NEWS)} 
            onNavigateToFleets={() => setView(AppView.FLEETS)} 
            onNavigateToRights={() => setView(AppView.KNOW_YOUR_RIGHTS)} 
            onNavigateToHardship={() => setView(AppView.HARDSHIP_HUB)}
            onNavigateByIntent={(viewId) => setView(viewId as any)}
          />;
    }
  };

  return (
    <div className="h-full w-full bg-slate-900 flex items-center justify-center overflow-hidden">
      <div className="h-full w-full max-w-md bg-slate-950 overflow-hidden relative shadow-2xl">
        <SystemErrorBoundary>
          {renderGlobalHeader()}
          {renderContent()}
        </SystemErrorBoundary>
        {showVoice && <VoiceAssistant onClose={() => setshowVoice(false)} />}
      </div>
    </div>
  );
};

// --- Helper Icons for Enterprise UI ---
const Building2Icon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export default App;
