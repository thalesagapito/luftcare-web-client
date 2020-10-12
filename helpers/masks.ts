/* eslint-disable import/prefer-default-export */
import msk from 'msk';

const eightDigitPhoneMask = '(99) 9999-9999';
const nineDigitPhoneMask = '(99) 9 9999-9999';

export function getMaskedPhoneNumber(unmaskedPhoneNumber: string): string {
  const digits = (unmaskedPhoneNumber || '').replace(/\D/g, '');
  const mask = digits.length >= 11 ? nineDigitPhoneMask : eightDigitPhoneMask;
  const maskedValue = msk.fit(digits, mask);

  return maskedValue;
}
