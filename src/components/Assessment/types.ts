import type {ReactNode} from 'react';
import type {GlyphName} from '../Glyph';

export type Option = {
  value: string;
  label: string;
  note?: string;
  input?: {suffix: string; placeholder?: string};
};

export type Field = {
  key: string;
  label: string;
  suffix: string;
  note?: string;
  placeholder?: string;
};

type Base = {
  key: string;
  glyph: GlyphName;
  title: string;
  lead?: string;
  why: {heading: string; body: ReactNode};
  showIf?: (answers: Answers) => boolean;
};

export type Estimate = {
  assumed: {label: string; value: string}[];
  source: string;
  open: string;
};

export type Step = Base &
  (
    | {kind: 'choice'; options: Option[]}
    | {kind: 'multi'; options: Option[]}
    | {kind: 'fields'; fields: Field[]; estimate?: Estimate}
  );

export type Answers = {
  choice: Record<string, string>;
  multi: Record<string, string[]>;
  field: Record<string, string>;
};

export const NO_ANSWERS: Answers = {choice: {}, multi: {}, field: {}};

export type ProfileLine = {
  label: string;
  value: string | null;
  pending?: string;
};

export function numberOf(answers: Answers, key: string, fallback: number): number {
  const raw = Number.parseFloat(answers.field[key] ?? '');
  return Number.isFinite(raw) ? raw : fallback;
}

export function visibleSteps(steps: Step[], answers: Answers): Step[] {
  return steps.filter((step) => !step.showIf || step.showIf(answers));
}
