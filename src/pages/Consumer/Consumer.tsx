import CommandField from '../Home/components/CommandField';
import {usePageTitle} from '../../lib/country';
import {useCallback, useMemo, useState} from 'react';
import {NO_ANSWERS, type Answers} from '../../components/Assessment/types';
import {readPosition} from '../../data/consumer';
import Summary, {CompactSummary} from './components/Summary';
import SystemCheck from './components/SystemCheck';

// `embedded` renders the journey inside the home page's pop-up instead of as its own page.
export default function Consumer({embedded = false}: {embedded?: boolean}) {
  usePageTitle(embedded ? undefined : 'Check my solar');
  const Root = embedded ? 'div' : 'main';
  const [answers, setAnswers] = useState<Answers>(NO_ANSWERS);
  const [generated, setGenerated] = useState(false);

  const position = useMemo(() => readPosition(answers), [answers]);

  const reset = useCallback(() => {
    setAnswers(NO_ANSWERS);
    setGenerated(false);
  }, []);

  return (
    <Root className="relative isolate overflow-hidden">
      {/* The pop-up stays plain: no moving background behind the questions. */}
      {embedded ? null : <CommandField />}

      {embedded && generated ? (
        <CompactSummary position={position} onRestart={reset} />
      ) : (
        <SystemCheck
          embedded={embedded}
          answers={answers}
          position={position}
          done={generated}
          onChange={setAnswers}
          onComplete={() => setGenerated(true)}
          onReset={reset}
        />
      )}

      {!embedded && generated ? <Summary position={position} /> : null}
    </Root>
  );
}
