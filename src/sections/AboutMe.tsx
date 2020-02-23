import Image, { FluidObject } from 'gatsby-image';
import React from 'react';
import { FluidImageFragment } from '../generatedGraphQL';

export interface Props {
  vera: FluidImageFragment;
}

const IMG_STYLE = { height: '100%' };

const ExperienceItem: React.FC = ({ children }) => (
  <li className="flex items-center">
    <span className="fas fa-check fill-current" />
    <span className="ml-4">{children}</span>
  </li>
);

const AboutMe: React.FC<Props> = ({ vera }) => (
  <section id="about" className="bg-gray-100">
    <div className="grid md:grid-cols-5">
      <div className="md:col-span-2">
        <Image fluid={vera.childImageSharp!.fluid as FluidObject} alt="Vera Lienhard" style={IMG_STYLE} />
      </div>
      <div className="md:col-span-3 container mx-auto px-8 pt-20 pb-40">
        <header>
          <h1 className="text-lg uppercase tracking-wider text-gray-800">Über mich</h1>
          <h2 className="section-header leading-none">Vera Lienhard</h2>
        </header>
        <div className="mt-6 flex flex-col items-start text-lg text-gray-700">
          <p>
            Es ist meine Überzeugung, dass durch die richtige Trainingsintervention fast alle bewegungsbezogenen Ziele
            erreicht und körperliche Beschwerden gelindert werden können. Mit diversen Aus- und Weiterbildungen in den
            Bereichen Gesundheits- und Athletiktraining habe ich mein fundiertes Grundwissen aus dem Sportstudium
            zielgerichtet gestärkt und erweitert. Gekoppelt mit meiner langjährigen Erfahrung im Unterrichten von
            Fitness-Stunden und Personal Trainings kann ich dich beim Erreichen deiner Ziele optimal unterstützen.
          </p>
          <p className="mt-4 text-xl text-gray-800 font-semibold leading-snug">
            Für Fragen zum Training oder zu mir stehe ich dir gerne zur Verfügung!
          </p>
          <ul className="mt-6 p-6 bg-white rounded-lg border text-gray-700">
            <ExperienceItem>Master Sportwissenschaft Universität Bern</ExperienceItem>
            <ExperienceItem>Konditionstrainerin SwissOlympic</ExperienceItem>
            <ExperienceItem>Medizinische Trainingstherapeutin MTT</ExperienceItem>
            <ExperienceItem>Pilates Instruktorin</ExperienceItem>
            <ExperienceItem>Power Yoga Instruktorin</ExperienceItem>
            <ExperienceItem>Faszien Trainerin</ExperienceItem>
            <ExperienceItem>Spiraldynamik Basic Med</ExperienceItem>
            <ExperienceItem>Beckenboden Instruktorin</ExperienceItem>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default AboutMe;
