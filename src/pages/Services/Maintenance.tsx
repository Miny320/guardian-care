import {useState} from 'react';
import {Link} from 'react-router';
import {CtaBand, NumberedGrid, PageHero, PagePhoto, PageSection} from '../../components/page';
import {PRIMARY} from '../../components/kit';
import {useLocalPath, usePageTitle} from '../../lib/country';
import {cn} from '../../lib/cn';

const SERVICES = [
  {name: 'Panel cleaning', line: 'Removing dirt and build-up that can reduce how much your panels generate.'},
  {name: 'Inverter diagnostics', line: 'Finding the cause of inverter alarms, error codes and drops in performance.'},
  {name: 'Performance checks', line: 'Comparing what your system makes against what it should, to spot unusual changes.'},
  {name: 'Electrical inspection', line: 'Checking isolators, connections and protection for safety and wear.'},
  {name: 'Planned servicing', line: 'Regular inspections, with recommendations based on the condition of your system.'},
  {name: 'Fault support', line: 'Help when your equipment develops a fault or starts behaving unexpectedly.'}
];

const SYMPTOMS = [
  {
    key: 'less',
    label: 'My solar is making less than it used to',
    means: 'Dirty panels, shading, a failing inverter or a wiring fault can all cut output. Comparing your generation against the weather shows which.',
    help: 'We run a performance check, then inspect and clean where the data points.'
  },
  {
    key: 'error',
    label: 'My inverter shows an error',
    means: 'Error codes range from a passing grid fault to a failing component. The code and the history around it tell us which.',
    help: 'We read the error, test the inverter, and repair or replace it if needed.'
  },
  {
    key: 'off',
    label: 'My system keeps switching off',
    means: 'Repeated shut-downs often point to grid voltage, a tripping protective device or an inverter fault.',
    help: 'We trace the cause and check the protection and connections involved.'
  },
  {
    key: 'clean',
    label: 'My panels need cleaning',
    means: 'Dust, bird droppings and moss build up over time, especially on low-angle roofs.',
    help: 'We clean the panels safely and check for damage while we are there.'
  },
  {
    key: 'monitor',
    label: 'I can’t see what my system is doing',
    means: 'Monitoring often stops after a router change, an app shutdown or a failed data logger.',
    help: 'We reconnect your monitoring or fit a suitable replacement.'
  },
  {
    key: 'inspect',
    label: 'I’d just like a general inspection',
    means: 'A system that has run for years without a check can hide wear that is easy to fix early.',
    help: 'We inspect, test and clean as needed, then explain what we found in plain words.'
  }
];

export default function Maintenance() {
  usePageTitle('Maintenance & diagnostics');

  return (
    <main>
      <PageHero
        title="Maintain your solar."
        accent="Understand how it’s doing."
        lead="Solar equipment needs inspecting and servicing to stay safe and reliable. We clean, test and investigate existing systems, whoever installed them."
        action={{label: 'Book a maintenance visit', to: '/contact?service=maintenance'}}
        aside={<PagePhoto src="/assets/photos/service-maintenance.jpg" alt="A technician cleaning roof solar panels from a safe access platform" />}
      />

      <PageSection title="Six services," accent="one visit if you need them.">
        <NumberedGrid items={SERVICES} />
      </PageSection>

      <PageSection title="What have you noticed" accent="about your solar?" lead="Choose the one closest to what you’re seeing.">
        <Symptoms />
      </PageSection>

      <CtaBand title="Book a maintenance visit." action={{label: 'Book solar maintenance', to: '/contact?service=maintenance'}} />
    </main>
  );
}

function Symptoms() {
  const [picked, setPicked] = useState(SYMPTOMS[0].key);
  const local = useLocalPath();
  const symptom = SYMPTOMS.find((item) => item.key === picked) ?? SYMPTOMS[0];

  return (
    <div className="grid gap-4 min-[1000px]:grid-cols-[1fr_1fr]">
      <div role="group" aria-label="What have you noticed?" className="grid gap-2.5">
        {SYMPTOMS.map((item) => {
          const on = item.key === picked;
          return (
            <button
              key={item.key}
              type="button"
              aria-pressed={on}
              onClick={() => setPicked(item.key)}
              className={cn(
                'rounded-card px-5 py-4 text-left text-[16px] transition duration-200',
                on ? 'bg-green-glow font-medium text-ink ring-2 ring-green' : 'bg-panel text-ink ring-1 ring-line-2 hover:ring-green/50'
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="rounded-frame bg-panel p-7 ring-1 ring-line-2 min-[760px]:p-9">
        <div key={symptom.key} className="animate-fadeup">
          <h3 className="font-display text-[clamp(24px,2.4vw,32px)] font-extrabold leading-[1.02] text-ink">
            What it may mean
          </h3>
          <p className="mt-3 text-[17px] font-light leading-[1.65] text-muted">{symptom.means}</p>
          <h3 className="mt-7 font-display text-[clamp(24px,2.4vw,32px)] font-extrabold leading-[1.02] text-green">
            How we help
          </h3>
          <p className="mt-3 text-[17px] font-light leading-[1.65] text-ink">{symptom.help}</p>
          <Link to={local('/contact?service=maintenance')} className={cn(PRIMARY, 'mt-8')}>
            Book a visit →
          </Link>
        </div>
      </div>
    </div>
  );
}
