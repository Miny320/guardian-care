import CommandField from '../Home/components/CommandField';
import {usePageTitle} from '../../lib/country';
import {useCallback, useMemo, useState} from 'react';
import {NO_ANSWERS, type Answers} from '../../components/Assessment/types';
import {readPlan} from '../../data/plan';
import Assess from './components/Assess';
import CompactPosition from './components/CompactPosition';
import Position from './components/Position';

// `embedded` renders the journey inside the home page's pop-up instead of as its own page.
export default function Plan({embedded = false}: {embedded?: boolean}) {
  usePageTitle(embedded ? undefined : 'Your energy plan');
  const Root = embedded ? 'div' : 'main';
  const [answers, setAnswers] = useState<Answers>(NO_ANSWERS);
  const [generated, setGenerated] = useState(false);

  const position = useMemo(() => readPlan(answers), [answers]);

  const reset = useCallback(() => {
    setAnswers(NO_ANSWERS);
    setGenerated(false);
  }, []);

  return (
    <Root className="relative isolate overflow-hidden">
      {/* The pop-up stays plain: no moving background behind the questions. */}
      {embedded ? null : <CommandField />}

      {embedded && generated ? (
        <CompactPosition position={position} onRestart={reset} />
      ) : (
        <Assess
          embedded={embedded}
          answers={answers}
          position={position}
          done={generated}
          onChange={setAnswers}
          onComplete={() => setGenerated(true)}
          onReset={reset}
        />
      )}

      {!embedded && generated ? <Position position={position} /> : null}
    </Root>
  );
}
