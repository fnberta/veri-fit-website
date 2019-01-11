import Image, { FluidObject } from 'gatsby-image';
import React from 'react';
import Heading from '../components/bulma/Heading';
import { FullHeightCard } from '../components/Layout';
import Schedule, { ScheduleEntry } from '../components/Schedule';
import { ChildImageSharp, FluidImage } from '../interfaces';

export interface OfferData {
  title: string;
  subtitle: string;
  image: ChildImageSharp<FluidImage>;
  schedule: ScheduleEntry[];
  html: string;
}

export interface Props {
  offerData: OfferData[];
}

const Offers: React.FC<Props> = ({ offerData }) => (
  <section id="offer" className="section has-background-light">
    <div className="container">
      <Heading className="has-text-centered" text="Training für dich!" size={1} />
      <div className="content has-text-centered">
        <p>
          Kraft, Stabilität, Beweglichkeit, Athletik, Elastizität, Ausdauer, Freude, Energie, Entspannung, Gesundheit,
          Haltung, Wohlbefinden – Gerne unterstütze ich dich beim Erreichen deiner Trainingsziele!
        </p>
        <p className="has-text-weight-bold">
          Finde dein optimales Training – für dein Wohlbefinden – für deinen Erfolg – für dich!
        </p>
      </div>
      <div className="columns">
        {offerData.map(data => (
          <div key={data.title} className="column">
            <FullHeightCard image={<Image fluid={data.image.childImageSharp.fluid} alt="Training image" />}>
              <Heading text={data.title} size={4} />
              <Heading text={data.subtitle} size={5} type="subtitle" />
              <div className="content">
                <div dangerouslySetInnerHTML={{ __html: data.html }} />
              </div>
              <Schedule entries={data.schedule} />
            </FullHeightCard>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Offers;
