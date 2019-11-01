import { Unsubscribe } from 'firebase';
import { DocumentSnapshot, Firestore } from './firebase';
import { MiniUser, Training, User } from '../../shared/interfaces';

export type TrainingInput = Omit<Training, 'id'>;

const TRAININGS_COLLECTION = 'trainings';

function parseTraining(snap: DocumentSnapshot): Training {
  return {
    id: snap.id,
    ...snap.data(),
  } as Training;
}

export default class TrainingRepository {
  constructor(private readonly db: Firestore) {}

  async create(input: TrainingInput): Promise<Training> {
    const ref = await this.db.collection(TRAININGS_COLLECTION).add(input);
    const snap = await ref.get();
    return parseTraining(snap);
  }

  observeAllForUser(user: User, onChange: (trainings: Training[]) => void): Unsubscribe {
    const miniUser: MiniUser = { id: user.id, name: user.name };
    return this.db
      .collection(TRAININGS_COLLECTION)
      .where('participants', 'array-contains', miniUser)
      .onSnapshot(querySnap => {
        const trainings = [] as Training[];
        querySnap.forEach(snap => {
          trainings.push(parseTraining(snap));
        });
        onChange(trainings);
      });
  }
}
