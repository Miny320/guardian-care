import {CtaBand} from '../../components/page';
import {usePageTitle} from '../../lib/country';
import Hero from './components/Hero';
import Approach from './components/Approach';
import Capabilities from './components/Capabilities';
import LiveDashboard from './components/LiveDashboard';
import Markets from './components/Markets';
import Paths from './components/Paths';
import WhatItIs from './components/WhatItIs';
import WhatWeDo from './components/WhatWeDo';
import Why from './components/Why';

export default function Home() {
  usePageTitle();

  return (
    <main className="relative isolate overflow-hidden">
      <Hero />
      <Paths />
      <WhatItIs />
      <Capabilities />
      <WhatWeDo />
      <Approach />
      <LiveDashboard />
      <Why />
      <Markets />

      <CtaBand
        title="See it for yourself, or talk it through?"
        lead="Whether your panels are already on the roof, still being planned, or installed across hundreds of homes, speak with the people who will look after it for years to come."
        tagline="Either way, Guardian Care stays for the long term."
        action={{label: 'Open my dashboard', to: '/start'}}
        secondary={{label: 'Talk to the team', to: '/contact'}}
      />
    </main>
  );
}
