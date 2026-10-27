import { useId } from 'react';

export function Sculpture() {
  const id = useId().replace(/:/g, '');
  return <div className="sculpture" aria-hidden="true">
    <div className="art-coordinate">JG / GROWTH SYSTEM</div>
    <svg viewBox="0 0 600 610" fill="none">
      <defs>
        <linearGradient id={`${id}r`} x1="120" y1="80" x2="440" y2="490" gradientUnits="userSpaceOnUse"><stop stopColor="#161616"/><stop offset=".18" stopColor="#8d8d8d"/><stop offset=".34" stopColor="#ececec"/><stop offset=".48" stopColor="#555"/><stop offset=".66" stopColor="#111"/><stop offset=".83" stopColor="#a0a0a0"/><stop offset="1" stopColor="#303030"/></linearGradient>
        <linearGradient id={`${id}p`} x1="150" y1="130" x2="460" y2="540" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity=".85"/><stop offset="1" stopColor="#bbb" stopOpacity=".25"/></linearGradient>
        <filter id={`${id}s`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
      </defs>
      <ellipse cx="308" cy="521" rx="169" ry="27" fill="#000" opacity=".16" filter={`url(#${id}s)`}/>
      <g className="sculpture-planes" stroke="#bdbdbd" strokeWidth="1">
        <path d="M65 437 304 310 542 437 303 565Z" fill={`url(#${id}p)`}/>
        <path d="M65 426 304 299 542 426 303 554Z" fill={`url(#${id}p)`}/>
        <path d="M82 335 304 216 525 335 303 454Z" fill={`url(#${id}p)`}/>
        <path d="M100 243 304 134 507 243 303 353Z" fill={`url(#${id}p)`}/>
      </g>
      <path d="M189 475C111 420 173 352 300 333C430 312 444 245 350 218C261 192 213 161 256 119C284 92 327 81 365 66" stroke="#252525" strokeWidth="79"/>
      <path d="M189 464C111 409 173 341 300 322C430 301 444 234 350 207C261 181 213 150 256 108C284 81 327 70 365 55" stroke={`url(#${id}r)`} strokeWidth="71"/>
      <path d="M181 443C125 404 190 355 307 338C440 315 460 226 356 193C276 168 238 148 270 118" stroke="#fff" strokeOpacity=".65" strokeWidth="2"/>
      <path d="M65 426 303 554 542 426M82 335 303 454 525 335" stroke="white" strokeOpacity=".8"/>
      <circle cx="445" cy="121" r="35" fill={`url(#${id}r)`}/>
    </svg>
    <span className="art-label art-label-top"><i/> VISIBILITY</span><span className="art-label art-label-bottom"><i/> POSSIBILITY, CONNECTED.</span>
    <div className="art-index"><span>SEARCH. EXPERIENCE. ENQUIRY.</span></div>
  </div>;
}

const labels: Record<string, [string, string, string]> = {
  search: ['Search discovery', 'Your website', 'Qualified enquiry'], answer: ['Customer question', 'A clear, useful answer', 'Supporting sources'], network: ['Brand facts', 'Relevant documents', 'Consistent understanding'],
  page: ['Page title & intent', 'Useful content & links', 'A clear next step'], outreach: ['Useful resource', 'Relevant publication', 'Earned reference'], map: ['Genuine service area', 'Accurate business details', 'Local enquiry'],
  board: ['Priority backlog', 'In progress', 'Reviewed & documented'], funnel: ['Relevant search', 'Aligned landing page', 'Verified enquiry'], creative: ['Audience & offer', 'Creative A / Creative B', 'Test & review'],
  campaign: ['Campaign structure', 'Platform checks', 'Conversion review'], sponsored: ['Organic answer', 'Sponsored · separate ad', 'Advertiser destination'], website: ['Desktop experience', 'Responsive layout', 'Working enquiry journey'],
};
export function ServiceVisual({ kind }: { kind: string }) {
  return <div className={`service-visual visual-${kind}`}>
    <div className="visual-topline"><span>THE CONNECTED VIEW</span></div>
    <div className="visual-panels" aria-hidden="true">{(labels[kind] || labels.search).map(label => <div className="visual-panel" key={label}><strong>{label}</strong><div className="skeleton"><i/><i/><i/></div>{kind === 'map' && <div className="map-pin">⌖</div>}</div>)}</div>
    <p>Illustrative process · not a performance result</p>
  </div>;
}
