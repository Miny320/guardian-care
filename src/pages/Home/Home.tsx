import CommandField from './components/CommandField';
import WaveSign from '../../context/layouts/WaveSign';
import CustomerView from './components/CustomerView';
import Hero from './components/Hero';
import Intelligence from './components/Intelligence';
import Journeys from './components/Journeys';
import Operations from './components/Operations';
import Pipeline from './components/Pipeline';
import Record from './components/Record';

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <CommandField />

      <Hero />
      <Journeys />
      <Pipeline />
      <Intelligence />
      <Operations />
      <CustomerView />
      <Record />
      <WaveSign />
    </main>
  );
}
