import CommandField from '../Home/components/CommandField';
import {useCallback, useMemo, useState} from 'react';
import {NO_ANSWERS, type Answers} from '../../components/Assessment/types';
import WaveSign from '../../context/layouts/WaveSign';
import {readPlan} from '../../data/plan';
import Afterwards from './components/Afterwards';
import Ask from './components/Ask';
import Assess from './components/Assess';
import Goal from './components/Goal';
import Hero from './components/Hero';
import Mechanism from './components/Mechanism';
import Position from './components/Position';
import Quote from './components/Quote';
import Storage from './components/Storage';

export default function Plan() {
  const [answers, setAnswers] = useState<Answers>(NO_ANSWERS);
  const [generated, setGenerated] = useState(false);

  const position = useMemo(() => readPlan(answers), [answers]);

  const reset = useCallback(() => {
    setAnswers(NO_ANSWERS);
    setGenerated(false);
  }, []);

  const pickGoal = useCallback((key: string) => {
    setAnswers((current) => ({...current, choice: {...current.choice, goal: key}}));
  }, []);

  return (
    <main className="relative isolate overflow-hidden">
      <CommandField />

      <Hero />

      <Goal goal={answers.choice.goal ?? null} onPick={pickGoal} />

      <Assess
        answers={answers}
        position={position}
        done={generated}
        onChange={setAnswers}
        onComplete={() => setGenerated(true)}
        onReset={reset}
      />

      {generated ? <Position position={position} /> : null}

      <Mechanism />
      <Storage />
      <Quote position={position} />
      <Afterwards />
      <Ask />

      <WaveSign />
    </main>
  );
}
