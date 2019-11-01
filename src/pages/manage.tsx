import { Redirect, Router } from '@reach/router';
import { graphql } from 'gatsby';
import React from 'react';
import Layout from '../components/Layout';
import { ManagePageQuery } from '../generatedGraphQL';
import initFirebase from '../manage/firebase';
import { RepoContext } from '../manage/RepoContext';
import SessionRepository from '../manage/SessionRepository';
import TrainingRepository from '../manage/TrainingRepository';
import Trainings from '../manage/Trainings';
import Users from '../manage/Users';
import UserRepository from '../manage/UserRepository';

const firebaseApp = initFirebase();
const db = firebaseApp.firestore();
const functions = firebaseApp.functions();
// functions.useFunctionsEmulator('http://localhost:5000');
const userRepo = new UserRepository(db);
const sessionRepo = new SessionRepository(db, functions);
const trainingRepo = new TrainingRepository(db);

export interface Props {
  data: ManagePageQuery;
}

const ManagePage: React.FC<Props> = ({ data }) => {
  console.log('data', data);
  return (
    <RepoContext.Provider value={{ userRepo, sessionRepo, trainingRepo }}>
      <Layout title="Verwalten">
        <Router>
          <Users path="/manage/users" />
          <Trainings path="/manage/trainings" />
          <Redirect default={true} noThrow={true} from="/" to="/manage/trainings" />
        </Router>
      </Layout>
    </RepoContext.Provider>
  );
};

export default ManagePage;

export const query = graphql`
  query ManagePage {
    schedule: allMarkdownRemark(filter: { frontmatter: { collection: { eq: "schedule" } } }) {
      nodes {
        frontmatter {
          title
          weekday
          timeOfDay
          time
        }
      }
    }
  }
`;
