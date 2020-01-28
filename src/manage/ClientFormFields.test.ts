import { validateClientForm } from './ClientFormFields';

const OPTIONAL_FIELDS = {
  email: '',
  birthday: '',
  phone: '',
  activeSubscriptions: [],
};

describe('validate', () => {
  test('should contain error for name if name is empty', () => {
    const result = validateClientForm({
      ...OPTIONAL_FIELDS,
      name: '',
      address: {
        street: '',
        number: '',
        zip: '',
        city: '',
      },
    });
    expect(result.name).toBeDefined();
  });

  test('should contain no errors if name is not empty and no part of address is given', () => {
    const result = validateClientForm({
      ...OPTIONAL_FIELDS,
      name: 'some-name',
      address: {
        street: '',
        number: '',
        zip: '',
        city: '',
      },
    });
    expect(Object.keys(result)).toHaveLength(0);
  });

  test('should contain error for parts of address if one part is given', () => {
    const streetResult = validateClientForm({
      ...OPTIONAL_FIELDS,
      name: 'some-name',
      address: {
        street: 'some-street',
        number: '',
        zip: '',
        city: '',
      },
    });
    expect(streetResult.address?.street).toBeUndefined();
    expect(streetResult.address?.number).toBeDefined();
    expect(streetResult.address?.zip).toBeDefined();
    expect(streetResult.address?.city).toBeDefined();

    const numberResult = validateClientForm({
      ...OPTIONAL_FIELDS,
      name: 'some-name',
      address: {
        street: '',
        number: '23',
        zip: '',
        city: '',
      },
    });
    expect(numberResult.address?.number).toBeUndefined();
    expect(numberResult.address?.street).toBeDefined();
    expect(numberResult.address?.zip).toBeDefined();
    expect(numberResult.address?.city).toBeDefined();

    const zipResult = validateClientForm({
      ...OPTIONAL_FIELDS,
      name: 'some-name',
      address: {
        street: '',
        number: '',
        zip: '8400',
        city: '',
      },
    });
    expect(zipResult.address?.zip).toBeUndefined();
    expect(zipResult.address?.street).toBeDefined();
    expect(zipResult.address?.number).toBeDefined();
    expect(zipResult.address?.city).toBeDefined();

    const cityResult = validateClientForm({
      ...OPTIONAL_FIELDS,
      name: 'some-name',
      address: {
        street: '',
        number: '',
        zip: '',
        city: 'Winterthur',
      },
    });
    expect(cityResult.address?.city).toBeUndefined();
    expect(cityResult.address?.street).toBeDefined();
    expect(cityResult.address?.number).toBeDefined();
    expect(cityResult.address?.zip).toBeDefined();
  });
});
