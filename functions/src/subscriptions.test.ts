import { PersonalSubscription, SubscriptionType, TrainingType, YogaSubscription } from './shared';
import { isSubscriptionActive, pickSubscriptionId } from './subscriptions';

describe('check wether subscription is active', () => {
  test('should return true if subscription is unpaid', () => {
    expect(
      isSubscriptionActive({
        id: 'some-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        trainingsLeft: 0,
        start: '2020-01-01',
        end: '2020-03-01',
      }),
    ).toBe(true);
  });

  test('should return true if subscription is paid and block', () => {
    expect(
      isSubscriptionActive({
        id: 'some-id',
        type: SubscriptionType.BLOCK,
        trainingType: TrainingType.BOOST,
        start: '2020-01-01',
        end: '2020-03-01',
        paidAt: '2020-01-01',
      }),
    ).toBe(true);
  });

  test('should return false if subscription is paid, non-block and has no trainings left', () => {
    expect(
      isSubscriptionActive({
        id: 'some-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        trainingsLeft: 0,
        start: '2020-01-01',
        end: '2020-03-01',
        paidAt: '2020-01-01',
      }),
    ).toBe(false);
  });

  test('should return true if subscription is paid, non-block and has trainings left', () => {
    expect(
      isSubscriptionActive({
        id: 'some-id',
        type: SubscriptionType.LIMITED_10,
        trainingType: TrainingType.YOGA,
        trainingsLeft: 7,
        start: '2020-01-01',
        end: '2020-03-01',
        paidAt: '2020-01-01',
      }),
    ).toBe(true);
  });
});

describe('pick subscription for update trainings left', () => {
  test('should throw if there are no subscriptions', () => {
    expect(() => pickSubscriptionId(false, [])).toThrow();
    expect(() => pickSubscriptionId(true, [])).toThrow();
  });

  describe('session confirmed', () => {
    test('should throw if no or multiple subscriptions with trainingsLeft', () => {
      expect(() => pickSubscriptionId(true, [])).toThrow();

      const nothingLeftSubscriptions: Array<YogaSubscription | PersonalSubscription> = [
        {
          id: 'some-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
          end: '2020-03-01',
        },
        {
          id: 'some-other-id',
          type: SubscriptionType.UNLIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
        },
      ];
      expect(() => pickSubscriptionId(true, nothingLeftSubscriptions)).toThrow();

      const multipleWithLeftSubscriptions: Array<YogaSubscription | PersonalSubscription> = [
        {
          id: 'some-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 8,
          start: '2020-01-01',
          end: '2020-03-01',
        },
        {
          id: 'some-other-id',
          type: SubscriptionType.UNLIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 7,
          start: '2020-01-01',
        },
      ];
      expect(() => pickSubscriptionId(true, multipleWithLeftSubscriptions)).toThrow();
    });

    test('should return subscription with trainingsLeft if there is exactly one', () => {
      const subscriptions: Array<YogaSubscription | PersonalSubscription> = [
        {
          id: 'some-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 8,
          start: '2020-01-01',
          end: '2020-03-01',
        },
        {
          id: 'some-other-id',
          type: SubscriptionType.UNLIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
        },
      ];
      expect(pickSubscriptionId(true, subscriptions)).toBe('some-id');
    });
  });

  describe('session opened', () => {
    test('should return subscription if there is only one', () => {
      const subscriptions: Array<YogaSubscription | PersonalSubscription> = [
        {
          id: 'some-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
          end: '2020-03-01',
        },
      ];
      expect(pickSubscriptionId(false, subscriptions)).toBe('some-id');
    });

    test('should return subscription with most recent end date if there are multiple', () => {
      const subscriptions: Array<YogaSubscription | PersonalSubscription> = [
        {
          id: 'some-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
          end: '2020-03-01',
        },
        {
          id: 'some-random-id',
          type: SubscriptionType.UNLIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-03-01',
        },
        {
          id: 'some-other-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
          end: '2020-05-01',
        },
        {
          id: 'some-other-other-id',
          type: SubscriptionType.UNLIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
        },
      ];
      expect(pickSubscriptionId(false, subscriptions)).toBe('some-other-id');
    });

    test('should return latest unlimited subscription if limited subscription is expired', () => {
      const subscriptions: Array<YogaSubscription | PersonalSubscription> = [
        {
          id: 'some-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
          end: '2020-02-01',
        },
        {
          id: 'some-other-other-id',
          type: SubscriptionType.UNLIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
        },
        {
          id: 'some-other-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
          end: '2020-01-01',
        },
        {
          id: 'some-other-other-id',
          type: SubscriptionType.UNLIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-03-01',
        },
      ];
      expect(pickSubscriptionId(false, subscriptions)).toBe('some-other-other-id');
    });
  });
});
