import ConsoleField from './components/ConsoleField';
import {usePageTitle} from '../../lib/country';
import {useCallback, useMemo, useState} from 'react';
import {NO_ANSWERS, type Answers} from '../../components/Assessment/types';
import {readBusiness} from '../../data/businessFlow';
import Assess from './components/Assess';
import CompactModel from './components/CompactModel';
import Model from './components/Model';

// `embedded` renders the journey inside the home page's pop-up instead of as its own page.
export default function Business({embedded = false}: {embedded?: boolean}) {
  usePageTitle(embedded ? undefined : 'For solar companies');
  const Root = embedded ? 'div' : 'main';
  const [answers, setAnswers] = useState<Answers>(NO_ANSWERS);
  const [generated, setGenerated] = useState(false);

  const position = useMemo(() => readBusiness(answers), [answers]);

  const reset = useCallback(() => {
    setAnswers(NO_ANSWERS);
    setGenerated(false);
  }, []);

  return (
    <Root className="relative isolate overflow-hidden">
      {/* The pop-up stays plain: no moving background behind the questions. */}
      {embedded ? null : <ConsoleField />}

      {embedded && generated ? (
        <CompactModel position={position} onRestart={reset} />
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

      {!embedded && generated ? <Model position={position} /> : null}
    </Root>
  );
}
