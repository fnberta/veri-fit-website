import firebase from 'firebase/app';
import { DateTime } from 'luxon';
import { Collection, getTimeForId, parseTraining, Training, TrainingInput } from '@veri-fit/common';

export default class TrainingRepository {
  constructor(private readonly db: firebase.firestore.Firestore) {}

  async create(input: TrainingInput): Promise<Training> {
    const { weekday } = DateTime.fromISO(input.runsFrom);
    const ref = this.db.collection(Collection.TRAININGS).doc(`${input.type}-${weekday}-${getTimeForId(input.time)}`);
    await ref.set(input);
    const snap = await ref.get();
    return parseTraining(snap);
  }

  async get(trainingId: string): Promise<Training> {
    const snap = await this.db.collection(Collection.TRAININGS).doc(trainingId).get();
    return parseTraining(snap);
  }

  observeAllForClients(clientId: string, onChange: (trainings: Training[]) => void): firebase.Unsubscribe {
    return this.db
      .collection(Collection.TRAININGS)
      .where('clientIds', 'array-contains', clientId)
      .onSnapshot((querySnap) => {
        const trainings = querySnap.docs.map(parseTraining);
        onChange(trainings);
      });
  }
}
