import { Check, MapPin, MousePointer2, Search, Target, Users } from 'lucide-react';

export function HomeServiceVisual({ kind }: { kind: 'search' | 'ads' | 'website' }) {
  return <figure className={`home-art home-art-${kind}`} aria-label={
    kind === 'search' ? 'Illustration: connect a local search with a relevant business page' :
    kind === 'ads' ? 'Illustration: align an audience, offer and advertising budget' :
    'Illustration: a clear service page leads to an easy enquiry'
  }>
    <div className="home-art-canvas" aria-hidden="true">
      {kind === 'search' ? <>
        <div className="art-search-query"><Search size={18}/><span>Find a service near me</span></div>
        <div className="art-search-result"><span className="art-location"><MapPin size={16}/> Hyderabad</span><strong>Your service. Easy to find.</strong><div className="art-copy-lines"><i/><i/></div><span className="art-result-label"><Check size={15}/> A relevant business page</span></div>
        <span className="art-orbit art-orbit-one"/><span className="art-orbit art-orbit-two"/>
      </> : kind === 'ads' ? <>
        <div className="art-audience"><Users size={19}/><span>The people you want to reach</span></div>
        <div className="art-target"><Target size={84} strokeWidth={1.25}/><span className="art-target-dot"/></div>
        <div className="art-campaign-pair"><span>Relevant offer</span><span>Defined budget</span></div>
      </> : <>
        <div className="art-browser"><div className="art-browser-bar"><i/><i/><i/><span>Your business website</span></div><div className="art-browser-content"><span className="art-page-label">YOUR SERVICE, EXPLAINED</span><strong>Make the next step clear.</strong><div className="art-copy-lines"><i/><i/></div><span className="art-contact-button">Send an enquiry</span><MousePointer2 className="art-pointer" size={33} fill="white"/></div></div>
      </>}
    </div>
    <figcaption>{kind === 'search' ? 'Be found for the services you sell.' : kind === 'ads' ? 'Connect the right audience with your offer.' : 'Turn a useful visit into a conversation.'}</figcaption>
  </figure>;
}
