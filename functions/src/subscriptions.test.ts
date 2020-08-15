import { DateTime } from 'luxon';
import { SubscriptionType, TrainingType, YogaSubscription } from './shared';
import { isSubscriptionActive, pickSubscriptionId } from './subscriptions';

describe('check whether subscription is active', () => {
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

  test('should return true if subscription is paid, block and end date is in the future', () => {
    const today = DateTime.local();
    expect(
      isSubscriptionActive({
        id: 'some-id',
        type: SubscriptionType.BLOCK,
        trainingType: TrainingType.BOOST,
        start: today.toISODate(),
        end: today.plus({ months: 2 }).toISODate(),
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

describe('pick subscription id to update trainingsLeft', () => {
  test('should return undefined if there are no subscriptions', () => {
    expect(pickSubscriptionId('confirmed', [])).toBeUndefined();
    expect(pickSubscriptionId('opened', [])).toBeUndefined();
  });

  describe('session confirmed', () => {
    test('should return undefined if no subscriptions available with trainingsLeft > 0', () => {
      const nothingLeftSubscriptions: YogaSubscription[] = [
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
      expect(pickSubscriptionId('confirmed', nothingLeftSubscriptions)).toBeUndefined();
    });

    test('should return undefined if multiple subscriptions available with trainingsLeft > 0', () => {
      const somethingLeftSubscriptions: YogaSubscription[] = [
        {
          id: 'some-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 4,
          start: '2020-01-01',
          end: '2020-03-01',
        },
        {
          id: 'some-other-id',
          type: SubscriptionType.UNLIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 2,
          start: '2020-01-01',
        },
      ];
      expect(pickSubscriptionId('confirmed', somethingLeftSubscriptions)).toBeUndefined();
    });

    test('should return id if there is exactly one subscription with trainingsLeft > 0', () => {
      const subscriptions: YogaSubscription[] = [
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
      expect(pickSubscriptionId('confirmed', subscriptions)).toBe('some-id');
    });
  });

  describe('session opened', () => {
    test('should return undefined if there are multiple subscriptions with trainingsLeft > 0', () => {
      const subscriptions: YogaSubscription[] = [
        {
          id: 'some-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 5,
          start: '2020-01-01',
          end: '2020-03-01',
        },
        {
          id: 'some-other-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 5,
          start: '2020-03-01',
          end: '2020-06-01',
        },
      ];
      expect(pickSubscriptionId('opened', subscriptions)).toBeUndefined();
    });

    test('should return id if there is only one subscription', () => {
      const subscriptions: YogaSubscription[] = [
        {
          id: 'some-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
          end: '2020-03-01',
        },
      ];
      expect(pickSubscriptionId('opened', subscriptions)).toBe('some-id');
    });

    test('should return id of subscription with trainingsLeft > 0 if there are multiple subscriptions but only one has trainingsLeft > 0', () => {
      const subscriptions: YogaSubscription[] = [
        {
          id: 'some-id',
          type: SubscriptionType.UNLIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
        },
        {
          id: 'some-other-id',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 5,
          start: '2020-03-01',
          end: '2020-06-01',
        },
        {
          id: 'some-other-other-id',
          type: SubscriptionType.LIMITED_20,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-06-01',
          end: '2020-09-01',
        },
      ];
      expect(pickSubscriptionId('opened', subscriptions)).toBe('some-other-id');
    });

    test('should return id of subscription with the most recent end date if there are multiple subscriptions but none of them has trainingsLeft > 0', () => {
      const subscriptions: YogaSubscription[] = [
        {
          id: 'limited-10-older',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
          end: '2020-03-01',
        },
        {
          id: 'unlimited-10',
          type: SubscriptionType.UNLIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-03-01',
        },
        {
          id: 'limited-10-newer',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: '2020-01-01',
          end: '2020-09-01',
        },
      ];
      expect(pickSubscriptionId('opened', subscriptions)).toBe('limited-10-newer');
    });

    test('should return latest unlimited subscription if limited subscription is expired', () => {
      const today = DateTime.local();
      const subscriptions: YogaSubscription[] = [
        {
          id: 'limited-10-expired',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: today.minus({ months: 6 }).toISODate(),
          end: today.minus({ months: 3 }).toISODate(),
        },
        {
          id: 'unlimited-10-older',
          type: SubscriptionType.UNLIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: today.minus({ months: 1 }).toISODate(),
        },
        {
          id: 'limited-10-expired-2',
          type: SubscriptionType.LIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: today.minus({ months: 9 }).toISODate(),
          end: today.minus({ months: 6 }).toISODate(),
        },
        {
          id: 'unlimited-10-latest',
          type: SubscriptionType.UNLIMITED_10,
          trainingType: TrainingType.YOGA,
          trainingsLeft: 0,
          start: today.toISODate(),
        },
      ];
      expect(pickSubscriptionId('opened', subscriptions)).toBe('unlimited-10-latest');
    });
  });
});
