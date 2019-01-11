import Image, { FluidObject } from 'gatsby-image';
import React from 'react';
import Heading from '../components/bulma/Heading';
import { ChildImageSharp, FluidImage } from '../interfaces';

export interface Props {
  vera: ChildImageSharp<FluidImage>;
}

const IMG_STYLE = { height: '100%' };

const AboutMe: React.FC<Props> = ({ vera }) => (
  <section id="about">
    <div className="columns is-marginless">
      <div className="column is-two-fifths is-paddingless">
        <Image fluid={vera.childImageSharp.fluid} title="Vera Lienhard" alt="Vera Lienhard" style={IMG_STYLE} />
      </div>
      <div className="column has-background-light">
        <div className="section">
          <Heading text="Über mich" size={1} />
          <Heading text="Vera Lienhard" size={3} type="subtitle" />
          <div className="content">
            <p>
              Es ist meine Überzeugung, dass durch die richtige Trainingsintervention fast alle bewegungsbezogenen Ziele
              erreicht und körperliche Beschwerden gelindert werden können. Mit diversen Aus- und Weiterbildungen in den
              Bereichen Gesundheits- und Athletiktraining habe ich mein fundiertes Grundwissen aus dem Sportstudium
              zielgerichtet gestärkt und erweitert. Gekoppelt mit meiner langjährigen Erfahrung im Unterrichten von
              Fitness-Stunden und Personal Trainings kann ich dich beim Erreichen deiner Ziele optimal unterstützen.
            </p>
            <p className="is-italic">Let’s do this!</p>
          </div>
          <Heading text="Ausbildungen" size={5} />
          <div className="content">
            <ul>
              <li> Master Sportwissenschaft Universität Bern</li>
              <li> Konditionstrainerin SwissOlympic</li>
              <li> Medizinische Trainingstherapeutin MTT</li>
              <li> Pilates Instruktorin</li>
              <li> Power Yoga Instruktorin</li>
              <li> Faszien Trainerin</li>
              <li> Spiraldynamik Basic Med</li>
              <li> Beckenboden Instruktorin</li>
            </ul>
          </div>
          <Heading
            text="Für Fragen zum Training oder zu mir stehe ich dir gerne zur Verfügung!"
            size={5}
            type="subtitle"
          />
        </div>
      </div>
    </div>
  </section>
);

export default AboutMe;
