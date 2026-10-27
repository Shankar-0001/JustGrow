import { useRef, useState, type KeyboardEvent } from 'react';
import { Search, Target, Settings2, ClipboardCheck, ChartNoAxesCombined, Check } from 'lucide-react';
import type { SeoProcessStep } from '../data/seoPageContent';

const icons = [Search, Target, Settings2, ClipboardCheck, ChartNoAxesCombined];

export function SEOProcessTabs({ slug, steps }: { slug: string; steps: SeoProcessStep[] }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function onKeyDown(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % steps.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + steps.length) % steps.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = steps.length - 1;
    else return;
    event.preventDefault(); setActive(next); buttons.current[next]?.focus();
  }
  return <div className="off-process-layout seo-process-layout">
    <div className="off-process-tabs" role="tablist" aria-label="Service delivery process" aria-orientation="vertical">{steps.map((step, i) => {
      const Icon = icons[i % icons.length];
      return <button key={step.id} type="button" id={`${slug}-tab-${step.id}`} role="tab" aria-controls={`${slug}-panel-${step.id}`} aria-selected={active === i} tabIndex={active === i ? 0 : -1} ref={el => { buttons.current[i] = el; }} onClick={() => setActive(i)} onKeyDown={event => onKeyDown(event, i)}><Icon size={22}/><span>{step.label}</span></button>;
    })}</div>
    <div>{steps.map((step, i) => {
      const Icon = icons[i % icons.length];
      return <div className="off-process-panel" key={step.id} id={`${slug}-panel-${step.id}`} role="tabpanel" aria-labelledby={`${slug}-tab-${step.id}`} tabIndex={0} hidden={active !== i}><span className="off-icon"><Icon size={30}/></span><h3>{step.title}</h3><p>{step.text}</p><ul className="off-checklist">{step.items.map(item => <li key={item}><Check size={18} aria-hidden="true"/>{item}</li>)}</ul><p className="off-output"><strong>What you receive</strong>{step.output}</p></div>;
    })}</div>
  </div>;
}
