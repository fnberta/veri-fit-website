import { DateTime } from 'luxon';
import { Session, SubscriptionType, TrainingType, Client } from '../../shared';
import { getToday } from './dateTime';
import { doesSubscriptionRunShort, isSubscriptionExpiring, showSessionConfirm } from './subscriptionChecks';

describe('expires', () => {
  test('should return false if type is UNLIMITED_10', () => {
    const result = isSubscriptionExpiring({
      id: 'random-id',
      type: SubscriptionType.UNLIMITED_10,
      category: TrainingType.YOGA,
      start: getToday(),
      trainingsLeft: 10,
    });
    expect(result).toBe(false);
  });

  test('should return false if type is not UNLIMITED_10 and end date is longer away than a week from today', () => {
    const today = DateTime.local();
    const result = isSubscriptionExpiring({
      id: 'random-id',
      type: SubscriptionType.LIMITED_10,
      category: TrainingType.YOGA,
      start: today.minus({ weeks: 2 }).toISODate(),
      end: today.plus({ weeks: 2 }).toISODate(),
      trainingsLeft: 10,
    });
    expect(result).toBe(false);
  });

  test('should return true if type is not UNLIMITED_10 and end date is one a week from today', () => {
    const today = DateTime.local();
    const result = isSubscriptionExpiring({
      id: 'random-id',
      type: SubscriptionType.LIMITED_10,
      category: TrainingType.YOGA,
      start: today.minus({ weeks: 2 }).toISODate(),
      end: today.plus({ weeks: 1 }).toISODate(),
      trainingsLeft: 10,
    });
    expect(result).toBe(true);
  });

  test('should return true if type is not UNLIMITED_10 and end date is within a week from today', () => {
    const today = DateTime.local();
    const result = isSubscriptionExpiring({
      id: 'random-id',
      type: SubscriptionType.LIMITED_10,
      category: TrainingType.YOGA,
      start: today.minus({ weeks: 2 }).toISODate(),
      end: today.plus({ days: 2 }).toISODate(),
      trainingsLeft: 10,
    });
    expect(result).toBe(true);
  });
});

describe('runs short', () => {
  test('should return false if type is UNLIMITED_10 or BLOCK', () => {
    expect(
      doesSubscriptionRunShort({
        id: 'random-id',
        type: SubscriptionType.UNLIMITED_10,
        category: TrainingType.YOGA,
        start: getToday(),
        trainingsLeft: 10,
      }),
    ).toBe(false);

    const today = DateTime.local();
    expect(
      doesSubscriptionRunShort({
        id: 'random-id',
        type: SubscriptionType.BLOCK,
        category: TrainingType.BOOST,
        start: today.minus({ weeks: 2 }).toISODate(),
        end: today.plus({ weeks: 1 }).toISODate(),
      }),
    ).toBe(false);
  });

  test('should return false if type is not UNLIMITED_10 or BLOCK and trainings left is smaller than the amount of weeks left', () => {
    const today = DateTime.local();
    const result = doesSubscriptionRunShort({
      id: 'random-id',
      type: SubscriptionType.LIMITED_10,
      category: TrainingType.YOGA,
      start: today.minus({ weeks: 2 }).toISODate(),
      end: today.plus({ weeks: 5 }).toISODate(),
      trainingsLeft: 3,
    });
    expect(result).toBe(false);
  });

  test('should return false if type is not UNLIMITED_10 or BLOCK and trainings left equals the amount of weeks left', () => {
    const today = DateTime.local();
    const result = doesSubscriptionRunShort({
      id: 'random-id',
      type: SubscriptionType.LIMITED_10,
      category: TrainingType.YOGA,
      start: today.minus({ weeks: 2 }).toISODate(),
      end: today.plus({ weeks: 4 }).toISODate(),
      trainingsLeft: 4,
    });
    expect(result).toBe(false);
  });

  test('should return true if type is not UNLIMITED_10 or BLOCK and trainings left is greater than the amount of weeks left', () => {
    const today = DateTime.local();
    const result = doesSubscriptionRunShort({
      id: 'random-id',
      type: SubscriptionType.LIMITED_10,
      category: TrainingType.YOGA,
      start: today.minus({ weeks: 2 }).toISODate(),
      end: today.plus({ weeks: 5 }).toISODate(),
      trainingsLeft: 7,
    });
    expect(result).toBe(true);
  });
});

describe('show session confirm', () => {
  test('show return false if session has clients with no matching subscription', () => {
    const clients = [
      {
        id: 'client-1',
        activeSubscriptions: [
          {
            type: SubscriptionType.LIMITED_10,
            category: TrainingType.PERSONAL,
            start: 'some-date',
            end: 'some-date',
            trainingsLeft: 5,
          },
        ],
      },
    ] as Client[];
    const session: Session = {
      id: 'some-id',
      trainingId: 'some-training-id',
      category: TrainingType.YOGA,
      clientIds: ['client-1'],
      confirmed: false,
      time: {
        start: '',
        end: '',
      },
      date: '',
    };

    const result = showSessionConfirm(clients, session);
    expect(result).toBe(false);
  });
  test('show return false if session has clients with a matching non-block subscription that has no trainings left', () => {
    const clients = [
      {
        id: 'client-1',
        activeSubscriptions: [
          {
            type: SubscriptionType.LIMITED_10,
            category: TrainingType.YOGA,
            start: 'some-date',
            end: 'some-date',
            trainingsLeft: 0,
          },
        ],
      },
    ] as Client[];
    const session: Session = {
      id: 'some-id',
      trainingId: 'some-training-id',
      category: TrainingType.YOGA,
      clientIds: ['client-1'],
      confirmed: false,
      time: {
        start: '',
        end: '',
      },
      date: '',
    };

    const result = showSessionConfirm(clients, session);
    expect(result).toBe(false);
  });
  test('show return true if session has clients with a matching block subscription', () => {
    const clients = [
      {
        id: 'client-1',
        activeSubscriptions: [
          {
            type: SubscriptionType.BLOCK,
            category: TrainingType.BOOST,
            start: 'some-date',
            end: 'some-date',
          },
        ],
      },
    ] as Client[];
    const session: Session = {
      id: 'some-id',
      trainingId: 'some-training-id',
      category: TrainingType.BOOST,
      clientIds: ['client-1'],
      confirmed: false,
      time: {
        start: '',
        end: '',
      },
      date: '',
    };

    const result = showSessionConfirm(clients, session);
    expect(result).toBe(true);
  });
  test('show return true if session has clients with a matching non-block subscription that has trainings left', () => {
    const clients = [
      {
        id: 'client-1',
        activeSubscriptions: [
          {
            type: SubscriptionType.LIMITED_10,
            category: TrainingType.YOGA,
            start: 'some-date',
            end: 'some-date',
            trainingsLeft: 2,
          },
        ],
      },
    ] as Client[];
    const session: Session = {
      id: 'some-id',
      trainingId: 'some-training-id',
      category: TrainingType.YOGA,
      clientIds: ['client-1'],
      confirmed: false,
      time: {
        start: '',
        end: '',
      },
      date: '',
    };

    const result = showSessionConfirm(clients, session);
    expect(result).toBe(true);
  });
});
