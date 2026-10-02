import ConsoleField from './components/ConsoleField';
import {useCallback, useMemo, useState} from 'react';
import {NO_ANSWERS, type Answers} from '../../components/Assessment/types';
import WaveSign from '../../context/layouts/WaveSign';
import {businessSummary, readBusiness} from '../../data/businessFlow';
import Assess from './components/Assess';
import Console from './components/Console';
import Hero from './components/Hero';
import Join from './components/Join';
import Markets from './components/Markets';
import Model from './components/Model';
import SendSummary from '../../components/SendSummary';
import Products from './components/Products';
import Revenue from './components/Revenue';
import Views from './components/Views';
import Watch from './components/Watch';

export default function Business() {
  const [answers, setAnswers] = useState<Answers>(NO_ANSWERS);
  const [generated, setGenerated] = useState(false);

  const position = useMemo(() => readBusiness(answers), [answers]);

  const reset = useCallback(() => {
    setAnswers(NO_ANSWERS);
    setGenerated(false);
  }, []);

  return (
    <main className="relative isolate overflow-hidden">
      <ConsoleField />

      <Hero />

      <Assess
        answers={answers}
        position={position}
        done={generated}
        onChange={setAnswers}
        onComplete={() => setGenerated(true)}
        onReset={reset}
      />

      {generated ? <Model position={position} /> : null}
      {generated ? (
        <SendSummary
          id="send"
          eyebrow=" Take it to the room"
          title="The short version,"
          accent="in writing."
          body="Your portfolio position as one message — the count, the coverage and the gap. Built to be forwarded to whoever signs it off."
          summary={businessSummary(position)}
          verb="Send my portfolio summary"
        />
      ) : null}

      <Products />
      <Console />
      <Watch />
      <Views />
      <Revenue />
      <Markets />
      <Join />

      <WaveSign />
    </main>
  );
}
