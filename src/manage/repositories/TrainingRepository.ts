import { Unsubscribe } from 'firebase';
import { Collection, parseTraining, Training, TrainingInput } from '../../../shared';
import { Firestore } from '../firebase';

export default class TrainingRepository {
  constructor(private readonly db: Firestore) {}

  async create(input: TrainingInput): Promise<Training> {
    const ref = this.db
      .collection(Collection.TRAININGS)
      .doc(`${input.type}-${input.weekday}-${input.time.start.replace(':', '')}-${input.time.end.replace(':', '')}`);
    await ref.set(input);
    const snap = await ref.get();
    return parseTraining(snap);
  }

  async get(trainingId: string): Promise<Training> {
    const snap = await this.db
      .collection(Collection.TRAININGS)
      .doc(trainingId)
      .get();
    return parseTraining(snap);
  }

  observeAllForClients(clientId: string, onChange: (trainings: Training[]) => void): Unsubscribe {
    return this.db
      .collection(Collection.TRAININGS)
      .where('clientIds', 'array-contains', clientId)
      .onSnapshot(querySnap => {
        const trainings = querySnap.docs.map(parseTraining);
        onChange(trainings);
      });
  }

  async update(trainingId: string, input: TrainingInput): Promise<Training> {
    const ref = this.db.collection(Collection.TRAININGS).doc(trainingId);
    await ref.update(input);
    const snap = await ref.get();
    return parseTraining(snap);
  }
}
