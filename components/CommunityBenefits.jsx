import { Sparkles } from 'lucide-react';
import { parseCommunityTakeaways } from '@/lib/community-takeaways.mjs';

/** Cinco mensagens em blocos de cor, logo abaixo da prévia de aulas. */
export default function CommunityBenefits({ takeaways }) {
  const items=parseCommunityTakeaways(takeaways);

  return (
    <section id="o-que-voce-vai-encontrar" className="bmc-takeaways-section" aria-labelledby="bmc-takeaways-heading">
      <div className="bmc-takeaways-inner">
        <div className="bmc-takeaways-heading">
          <span className="eyebrow">COMUNIDADE BOTA A MÃO NA CONSCIÊNCIA</span>
          <h2 id="bmc-takeaways-heading">O que você <em>vai encontrar?</em></h2>
        </div>
        <div className="bmc-takeaways-grid" role="list">
          {items.map((content,index)=>(
            <article className="bmc-takeaway-card" role="listitem" key={index}>
              <div className="bmc-takeaway-meta">
                <span>{String(index+1).padStart(2,'0')}</span>
                <Sparkles size={20} strokeWidth={1.5} aria-hidden="true"/>
              </div>
              <p>{content}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
