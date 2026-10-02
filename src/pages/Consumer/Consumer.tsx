import CommandField from '../Home/components/CommandField';
import {useCallback, useMemo, useState} from 'react';
import {NO_ANSWERS, type Answers} from '../../components/Assessment/types';
import WaveSign from '../../context/layouts/WaveSign';
import {consumerSummary, readPosition} from '../../data/consumer';
import Activation from './components/Activation';
import Aim from './components/Aim';
import Findings from './components/Findings';
import Hero from './components/Hero';
import SendSummary from '../../components/SendSummary';
import Summary from './components/Summary';
import SystemCheck from './components/SystemCheck';
import Why from './components/Why';

export default function Consumer() {
  const [answers, setAnswers] = useState<Answers>(NO_ANSWERS);
  const [generated, setGenerated] = useState(false);

  const position = useMemo(() => readPosition(answers), [answers]);

  const reset = useCallback(() => {
    setAnswers(NO_ANSWERS);
    setGenerated(false);
  }, []);

  return (
    <main className="relative isolate overflow-hidden">
      <CommandField />

      <Hero />

      <SystemCheck
        answers={answers}
        position={position}
        done={generated}
        onChange={setAnswers}
        onComplete={() => setGenerated(true)}
        onReset={reset}
      />

      {generated ? <Summary position={position} /> : null}
      {generated ? (
        <SendSummary
          id="send"
          eyebrow=" Keep your summary"
          title="Take this"
          accent="with you."
          body="Everything above, sent as one message. Read it now, forward it to whoever else decides, or keep it until your system is connected."
          summary={consumerSummary(position)}
          verb="Send my system summary"
        />
      ) : null}

      <Why />
      <Findings />
      <Activation />
      <Aim />

      <WaveSign />
    </main>
  );
}
