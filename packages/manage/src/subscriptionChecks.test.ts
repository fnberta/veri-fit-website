import { DateTime } from 'luxon';
import {
  BoostSubscription,
  Client,
  HiitSubscription,
  PersonalSubscription,
  Session,
  SubscriptionType,
  TrainingType,
  YogaSubscription,
} from '@veri-fit/common';
import { getToday } from './dateTime';
import {
  getActiveSubscriptionTags,
  getClientsWithIssues,
  getValidTrainingTypes,
  trainingTypes,
} from './subscriptionChecks';

describe('valid training types', () => {
  test('should only include training types for which there is no valid subscription', () => {
    const withValidBoostSubscription: BoostSubscription[] = [
      {
        id: 'valid-boost-sub',
        type: SubscriptionType.BLOCK,
        trainingType: TrainingType.BOOST,
        start: DateTime.local().minus({ months: 1 }).toISODate(),
        end: DateTime.local().plus({ months: 2 }).toISODate(),
      },
    ];
    expect(getValidTrainingTypes(withValidBoostSubscription)).toEqual(
      trainingTypes.filter((type) => type !== TrainingType.BOOST),
    );

    const withValidYogaSubscription: YogaSubscription[] = [
      {
        id: 'valid-yoga-sub',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        start: '1990-02-02',
        end: '1990-03-02',
        trainingsLeft: 5,
      },
    ];
    expect(getValidTrainingTypes(withValidYogaSubscription)).toEqual(
      trainingTypes.filter((type) => type !== TrainingType.YOGA),
    );

    const withValidPersonalSubscription: PersonalSubscription[] = [
      {
        id: 'valid-personal-sub',
        type: SubscriptionType.SINGLE,
        trainingType: TrainingType.PERSONAL,
        start: '1990-02-02',
        end: '1990-03-02',
        trainingsLeft: 1,
      },
    ];
    expect(getValidTrainingTypes(withValidPersonalSubscription)).toEqual(
      trainingTypes.filter((type) => type !== TrainingType.PERSONAL),
    );

    const withValidHiitSubscription: HiitSubscription[] = [
      {
        id: 'valid-hiit-sub',
        type: SubscriptionType.BLOCK,
        trainingType: TrainingType.HIIT,
        start: DateTime.local().minus({ months: 1 }).toISODate(),
        end: DateTime.local().plus({ months: 2 }).toISODate(),
      },
    ];
    expect(getValidTrainingTypes(withValidHiitSubscription)).toEqual(
      trainingTypes.filter((type) => type !== TrainingType.HIIT),
    );
  });
});

describe('active subscription tags', () => {
  describe('unpaid', () => {
    test('should return false if paidAt is set', () => {
      const today = getToday();
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.UNLIMITED_10,
        trainingType: TrainingType.YOGA,
        start: today,
        trainingsLeft: 10,
        paidAt: today,
      });
      expect(result.unpaid).toBe(false);
    });

    test('should return true if paidAt not set', () => {
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.UNLIMITED_10,
        trainingType: TrainingType.YOGA,
        start: getToday(),
        trainingsLeft: 10,
      });
      expect(result.unpaid).toBe(true);
    });
  });

  describe('expired', () => {
    test('should return false if type is UNLIMITED_10', () => {
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.UNLIMITED_10,
        trainingType: TrainingType.YOGA,
        start: getToday(),
        trainingsLeft: 10,
      });
      expect(result.expired).toBe(false);
    });

    test('should return true if type is not UNLIMITED_10 and end date is earlier than today', () => {
      const today = DateTime.local();
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        start: today.minus({ weeks: 2 }).toISODate(),
        end: today.minus({ weeks: 1 }).toISODate(),
        trainingsLeft: 10,
      });
      expect(result.expired).toBe(true);
    });
  });

  describe('expiring', () => {
    test('should return false if type is UNLIMITED_10', () => {
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.UNLIMITED_10,
        trainingType: TrainingType.YOGA,
        start: getToday(),
        trainingsLeft: 10,
      });
      expect(result.expiring).toBe(false);
    });

    test('should return false if expired', () => {
      const today = DateTime.local();
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        start: today.minus({ weeks: 2 }).toISODate(),
        end: today.minus({ weeks: 1 }).toISODate(),
        trainingsLeft: 10,
      });
      expect(result.expiring).toBe(false);
    });

    test('should return false if type is not UNLIMITED_10 and end date is longer away than a week from today', () => {
      const today = DateTime.local();
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        start: today.minus({ weeks: 2 }).toISODate(),
        end: today.plus({ weeks: 2 }).toISODate(),
        trainingsLeft: 10,
      });
      expect(result.expiring).toBe(false);
    });

    test('should return false is type is not UNLIMITED_10 and end date is one week before today', () => {
      const today = DateTime.local();
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        start: today.minus({ weeks: 2 }).toISODate(),
        end: today.minus({ weeks: 1 }).toISODate(),
        trainingsLeft: 10,
      });
      expect(result.expiring).toBe(false);
    });

    test('should return true if type is not UNLIMITED_10 and end date is one a week from today', () => {
      const today = DateTime.local();
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        start: today.minus({ weeks: 2 }).toISODate(),
        end: today.plus({ weeks: 1 }).toISODate(),
        trainingsLeft: 10,
      });
      expect(result.expiring).toBe(true);
    });

    test('should return true if type is not UNLIMITED_10 and end date is within a week from today', () => {
      const today = DateTime.local();
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        start: today.minus({ weeks: 2 }).toISODate(),
        end: today.plus({ days: 2 }).toISODate(),
        trainingsLeft: 10,
      });
      expect(result.expiring).toBe(true);
    });
  });

  describe('runsShort', () => {
    test('should return false if type is UNLIMITED_10 or BLOCK', () => {
      const resultUnlimited = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.UNLIMITED_10,
        trainingType: TrainingType.YOGA,
        start: getToday(),
        trainingsLeft: 10,
      });
      expect(resultUnlimited.runsShort).toBe(false);

      const today = DateTime.local();
      const resultBlock = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.BLOCK,
        trainingType: TrainingType.BOOST,
        start: today.minus({ weeks: 2 }).toISODate(),
        end: today.plus({ weeks: 1 }).toISODate(),
      });
      expect(resultBlock.runsShort).toBe(false);
    });

    test('should return false if expired', () => {
      const today = DateTime.local();
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        start: today.minus({ weeks: 2 }).toISODate(),
        end: today.minus({ weeks: 1 }).toISODate(),
        trainingsLeft: 3,
      });
      expect(result.runsShort).toBe(false);
    });

    test('should return false if type is not UNLIMITED_10 or BLOCK and trainings left is smaller than the amount of weeks left', () => {
      const today = DateTime.local();
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        start: today.minus({ weeks: 2 }).toISODate(),
        end: today.plus({ weeks: 5 }).toISODate(),
        trainingsLeft: 3,
      });
      expect(result.runsShort).toBe(false);
    });

    test('should return false if type is not UNLIMITED_10 or BLOCK and trainings left equals the amount of weeks left', () => {
      const today = DateTime.local();
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        start: today.minus({ weeks: 2 }).toISODate(),
        end: today.plus({ weeks: 4 }).toISODate(),
        trainingsLeft: 4,
      });
      expect(result.runsShort).toBe(false);
    });

    test('should return true if type is not UNLIMITED_10 or BLOCK and trainings left is greater than the amount of weeks left', () => {
      const today = DateTime.local();
      const result = getActiveSubscriptionTags({
        id: 'random-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        start: today.minus({ weeks: 2 }).toISODate(),
        end: today.plus({ weeks: 5 }).toISODate(),
        trainingsLeft: 7,
      });
      expect(result.runsShort).toBe(true);
    });
  });
});

describe('clients with issues', () => {
  test('should return empty list if session is confirmed', () => {
    const clients = [
      {
        id: 'client-1',
        activeSubscriptions: [
          {
            type: SubscriptionType.LIMITED_10,
            trainingType: TrainingType.PERSONAL,
            start: 'some-date',
            end: 'some-date',
            trainingsLeft: 5,
          },
        ],
      },
    ] as Client[];
    const session: Session = {
      id: 'some-id',
      type: TrainingType.YOGA,
      runsFrom: getToday(),
      time: {
        start: '',
        end: '',
      },
      clientIds: ['client-1'],
      trainingId: 'some-training-id',
      date: '',
      confirmed: true,
    };

    const result = getClientsWithIssues(clients, session);
    expect(result).toEqual([]);
  });

  test('should return faulty clients if session has clients with no matching subscription', () => {
    const clients = [
      {
        id: 'client-1',
        activeSubscriptions: [
          {
            type: SubscriptionType.LIMITED_10,
            trainingType: TrainingType.PERSONAL,
            start: 'some-date',
            end: 'some-date',
            trainingsLeft: 5,
          },
        ],
      },
    ] as Client[];
    const session: Session = {
      id: 'some-id',
      type: TrainingType.YOGA,
      runsFrom: getToday(),
      time: {
        start: '',
        end: '',
      },
      clientIds: ['client-1'],
      trainingId: 'some-training-id',
      date: '',
      confirmed: false,
    };

    const result = getClientsWithIssues(clients, session);
    expect(result).toEqual(clients);
  });
  test('should return faulty clients if session has clients with a matching non-block subscription that has no trainings left', () => {
    const clients = [
      {
        id: 'client-1',
        activeSubscriptions: [
          {
            type: SubscriptionType.LIMITED_10,
            trainingType: TrainingType.YOGA,
            start: 'some-date',
            end: 'some-date',
            trainingsLeft: 0,
          },
        ],
      },
    ] as Client[];
    const session: Session = {
      id: 'some-id',
      type: TrainingType.YOGA,
      runsFrom: getToday(),
      time: {
        start: '',
        end: '',
      },
      clientIds: ['client-1'],
      trainingId: 'some-training-id',
      date: '',
      confirmed: false,
    };

    const result = getClientsWithIssues(clients, session);
    expect(result).toEqual(clients);
  });
  test('should return empty list if session has clients with a matching block subscription', () => {
    const clients = [
      {
        id: 'client-1',
        activeSubscriptions: [
          {
            type: SubscriptionType.BLOCK,
            trainingType: TrainingType.BOOST,
            start: 'some-date',
            end: 'some-date',
          },
        ],
      },
    ] as Client[];
    const session: Session = {
      id: 'some-id',
      type: TrainingType.BOOST,
      runsFrom: getToday(),
      time: {
        start: '',
        end: '',
      },
      clientIds: ['client-1'],
      trainingId: 'some-training-id',
      date: '',
      confirmed: false,
    };

    const result = getClientsWithIssues(clients, session);
    expect(result).toEqual([]);
  });
  test('should return empty list if session has clients with a matching non-block subscription that has trainings left', () => {
    const clients = [
      {
        id: 'client-1',
        activeSubscriptions: [
          {
            type: SubscriptionType.LIMITED_10,
            trainingType: TrainingType.YOGA,
            start: 'some-date',
            end: 'some-date',
            trainingsLeft: 2,
          },
        ],
      },
    ] as Client[];
    const session: Session = {
      id: 'some-id',
      type: TrainingType.YOGA,
      runsFrom: getToday(),
      time: {
        start: '',
        end: '',
      },
      clientIds: ['client-1'],
      trainingId: 'some-training-id',
      date: '',
      confirmed: false,
    };

    const result = getClientsWithIssues(clients, session);
    expect(result).toEqual([]);
  });

  test('should return empty list if session has clients with a multiple matching non-block subscriptions, where at least one (which might not be the first) has trainings left', () => {
    const clients = [
      {
        id: 'client-1',
        activeSubscriptions: [
          {
            type: SubscriptionType.LIMITED_10,
            trainingType: TrainingType.YOGA,
            start: 'some-date',
            end: 'some-date',
            trainingsLeft: 0,
          },
          {
            type: SubscriptionType.LIMITED_10,
            trainingType: TrainingType.YOGA,
            start: 'some-date',
            end: 'some-date',
            trainingsLeft: 2,
          },
        ],
      },
    ] as Client[];
    const session: Session = {
      id: 'some-id',
      type: TrainingType.YOGA,
      runsFrom: getToday(),
      time: {
        start: '',
        end: '',
      },
      clientIds: ['client-1'],
      trainingId: 'some-training-id',
      date: '',
      confirmed: false,
    };

    const result = getClientsWithIssues(clients, session);
    expect(result).toEqual([]);
  });
});
