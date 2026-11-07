import { useHashRoute } from './lib/router';
import { AppShell } from './components/AppShell';
import { Home } from './stages/Home';
import { PhaseView } from './stages/PhaseView';
import { ChecklistView } from './stages/ChecklistView';
import { SettingsView } from './stages/SettingsView';

export default function App() {
  const route = useHashRoute();
  const [first, second] = route;

  let view;
  if (first === 'settings') view = <SettingsView />;
  else if (first && second) view = <ChecklistView phaseId={first} flowId={second} />;
  else if (first) view = <PhaseView phaseId={first} />;
  else view = <Home />;

  return <AppShell>{view}</AppShell>;
}
