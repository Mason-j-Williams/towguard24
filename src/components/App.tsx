import React, { useState, ReactNode, useEffect, ErrorInfo, Component } from 'react';
import { AppView, TowStatus, TowProvider } from '../types';
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

// Icons
import { Map as MapIcon, Shield, User, Newspaper, RefreshCw, AlertTriangle, HeartPulse } from 'lucide-react';

interface ErrorFallbackProps {
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onReset }) => (
  <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center p-10 text-center space-y-6">
    <div className="w-20 h-20 bg-red-950/20 rounded-3xl flex items-center justify-center border border-red-900/30">
      <AlertTriangle className="w-10 h-10 text-red-500" />
    </div>
    <div className="space-y-2">
      <h2 className="text-xl font-black text-slate-200 uppercase italic text-left">Link Failure</h2>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-left">Re-syncing with towguard24.com...</p>
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

// Fix: Explicitly extend Component from 'react' to ensure 'state', 'setState', and 'props' are correctly typed.
class SystemErrorBoundary extends Component<SystemErrorBoundaryProps, SystemErrorBoundaryState> {
  public state: SystemErrorBoundaryState = { hasError: false };

  constructor(props: SystemErrorBoundaryProps) {
    super(props);
  }

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

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [status, setStatus] = useState<TowStatus>(TowStatus.IDLE);
  const [selectedProvider, setSelectedProvider] = useState<TowProvider | null>(null);
  const [showVoice, setShowVoice] = useState(false);
  const { location } = useGeolocation();

  useEffect(() => {
    const isRegistered = localStorage.getItem('towguard_user_registered');
    if (isRegistered === 'true') {
      setView(AppView.HOME);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('towguard_user_registered');
    localStorage.removeItem('towguard_user_profile');
    setView(AppView.LANDING);
  };

  const renderNavbar = () => (
    <nav className="bg-slate-950 border-t border-white/5 px-6 pt-4 pb-10 flex justify-between items-center shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {[
        { id: AppView.HOME, icon: MapIcon, label: 'Map' },
        { id: AppView.GUARD, icon: Shield, label: 'Guard' },
        { id: AppView.NEWS, icon: Newspaper, label: 'News' },
        { id: AppView.HARDSHIP_HUB, icon: HeartPulse, label: 'Crisis' },
        { id: AppView.PROFILE, icon: User, label: 'Profile' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center gap-1.5 transition-all min-w-[50px] ${view === item.id ? 'text-safety-orange scale-110' : 'text-slate-500 hover:text-slate-200'}`}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
        </button>
      ))}
    </nav>
  );

  const renderContent = () => {
    switch (view) {
      case AppView.LANDING:
        return <LandingView onLaunch={() => setView(AppView.HOME)} onRegister={() => setView(AppView.ONBOARDING)} onLogin={() => setView(AppView.ONBOARDING)} onNavigateToNews={() => setView(AppView.NEWS)} onNavigateToFleets={() => setView(AppView.FLEETS)} onNavigateToRights={() => setView(AppView.KNOW_YOUR_RIGHTS)} onNavigateToHardship={() => setView(AppView.HARDSHIP_HUB)} />;
      case AppView.ONBOARDING:
        return <OnboardingView onComplete={() => setView(AppView.HOME)} />;
      case AppView.HOME:
        return (
          <div className="h-full flex flex-col bg-slate-950">
            <div className="flex-1 relative overflow-hidden">
              <MapInterface status={status} selectedProvider={selectedProvider} onProviderSelect={(p) => { setSelectedProvider(p); setStatus(TowStatus.ACCEPTED); setView(AppView.TRACKING); }} userLocation={location} />
              <button onClick={() => setShowVoice(true)} className="absolute top-12 right-6 p-4 bg-safety-orange rounded-full text-white shadow-xl z-[400] active:scale-95 transition-all"><Shield className="w-6 h-6" /></button>
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
        return <ProfileView onBack={() => setView(AppView.HOME)} onNavigateToDev={() => setView(AppView.DEV_PORTAL)} onNavigateToSales={() => setView(AppView.SALES)} onNavigateToBlueprints={() => setView(AppView.BLUEPRINTS)} onNavigateToReviews={() => setView(AppView.REVIEWS)} onNavigateToPresentation={() => setView(AppView.PRESENTATION)} onLogout={handleLogout} />;
      case AppView.DEV_PORTAL:
        return <DevPortal onBack={() => setView(AppView.PROFILE)} />;
      case AppView.PRESENTATION:
        return <PresentationView onBack={() => setView(AppView.PROFILE)} />;
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
      default: return <LandingView onLaunch={() => setView(AppView.HOME)} onRegister={() => setView(AppView.ONBOARDING)} onLogin={() => setView(AppView.ONBOARDING)} onNavigateToNews={() => setView(AppView.NEWS)} onNavigateToFleets={() => setView(AppView.FLEETS)} onNavigateToRights={() => setView(AppView.KNOW_YOUR_RIGHTS)} onNavigateToHardship={() => setView(AppView.HARDSHIP_HUB)} />;
    }
  };

  return (
    <div className="h-full w-full bg-slate-900 flex items-center justify-center overflow-hidden">
      <div className="h-full w-full max-w-md bg-slate-950 overflow-hidden relative shadow-2xl">
        <SystemErrorBoundary>
          {renderContent()}
        </SystemErrorBoundary>
        {showVoice && <VoiceAssistant onClose={() => setShowVoice(false)} />}
      </div>
    </div>
  );
};

export default App;
git push

mkdir -p src
touch src/App.tsx
code src/App.tsx

