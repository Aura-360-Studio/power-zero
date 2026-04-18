import { AppShell } from './presentation/components/AppShell';
import { Dashboard } from './presentation/pages/Dashboard';
import { Archives } from './presentation/pages/Archives';
import { Settings } from './presentation/pages/Settings';
import { SentinelDetails } from './presentation/pages/SentinelDetails';
import { Profile } from './presentation/pages/Profile';
import { Pulse } from './presentation/pages/Pulse';
import { SplashScreen } from './presentation/components/organisms/SplashScreen';
import { useRouterStore } from './presentation/store/useRouterStore';

function App() {
  const { currentView } = useRouterStore();

  return (
    <>
      <SplashScreen />
      <AppShell>
        <div key={currentView} className="animate-page-in">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'archive' && <Archives />}
          {currentView === 'settings' && <Settings />}
          {currentView === 'details' && <SentinelDetails />}
          {currentView === 'profile' && <Profile />}
          {currentView === 'pulse' && <Pulse />}
        </div>
      </AppShell>
    </>
  );
}

export default App;
