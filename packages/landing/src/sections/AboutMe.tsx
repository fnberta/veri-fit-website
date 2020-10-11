import Image, { FluidObject } from 'gatsby-image';
import React from 'react';
import { Icon } from '@veri-fit/common-ui';

export interface Props {
  vera: FluidObject;
}

const IMG_STYLE = { maxHeight: 300 };

const ExperienceItem: React.FC = ({ children }) => (
  <li className="flex items-center">
    <Icon className="h-6 w-6" name="check" />
    <span className="ml-4">{children}</span>
  </li>
);

const AboutMe: React.FC<Props> = ({ vera }) => (
  <section id="about" className="bg-gray-100">
    <div className="max-w-screen-xl mx-auto px-8 pt-20 pb-40">
      <div className="-ml-12 -mt-12 flex flex-wrap justify-center">
        <header className="w-2/5 flex-auto ml-12 mt-12">
          <h1 className="text-lg uppercase tracking-wider text-gray-800">Über mich</h1>
          <h2 className="text-5xl font-semibold leading-none">Vera Lienhard</h2>
          <p className="mt-8 text-xl text-gray-700">
            Es ist meine Überzeugung, dass durch die richtige Trainingsintervention fast alle bewegungsbezogenen Ziele
            erreicht und körperliche Beschwerden gelindert werden können. Mit diversen Aus- und Weiterbildungen in den
            Bereichen Gesundheits- und Athletiktraining habe ich mein fundiertes Grundwissen aus dem Sportstudium
            zielgerichtet gestärkt und erweitert. Gekoppelt mit meiner langjährigen Erfahrung im Unterrichten von
            Fitness-Stunden und Personal Trainings kann ich dich beim Erreichen deiner Ziele optimal unterstützen.
          </p>
          <p className="mt-4 text-2xl text-gray-800 font-semibold leading-snug">
            Für Fragen zum Training oder zu mir stehe ich dir gerne zur Verfügung!
          </p>
        </header>
        <div className="card ml-12 mt-12">
          <Image fluid={vera} alt="Vera Lienhard" style={IMG_STYLE} />
          <ul className="card-body text-lg text-gray-700">
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
