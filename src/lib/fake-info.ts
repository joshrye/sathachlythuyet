import nameData from '../assets/data/vietnamese-names.json';
import type { CandidateInfo } from './types';

/**
 * Synthetic Vietnamese candidate data for demos and tests.
 *
 * The generated identity number follows the public 12-digit structure:
 * - 3 digits: registered birthplace code
 * - 1 digit: century and gender
 * - 2 digits: last two digits of the birth year
 * - 6 digits: random sequence
 *
 * These values are synthetic and must not be used as real identity data.
 */

const VIETNAM_BIRTHPLACE_CODES = Object.freeze([
  '001', '002', '004', '006', '008', '010', '011', '012', '014', '015',
  '017', '019', '020', '022', '024', '025', '026', '027', '030', '031',
  '033', '034', '035', '036', '037', '038', '040', '042', '044', '045',
  '046', '048', '049', '051', '052', '054', '056', '058', '060', '062',
  '064', '066', '067', '068', '070', '072', '074', '075', '077', '079',
  '080', '082', '083', '084', '086', '087', '089', '091', '092', '093',
  '094', '095', '096'
]);

const DEFAULT_DOUBLE_SURNAME_RATE = 0.12;
const DEFAULT_MIN_AGE = 18;
const DEFAULT_MAX_AGE = 60;
const EARLIEST_CCCD_BIRTH_YEAR = 1900;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const CANDIDATE_ADDRESS = 'VIỆT NAM';
const candidateInfoByNumber = new Map<string, FakeInfo>();

type Gender = 'male' | 'female';
type RandomSource = () => number;

export interface FakeInfoOptions {
  minAge?: number;
  maxAge?: number;
  random?: RandomSource;
}

export type FakeInfo = CandidateInfo;

/** Reuse generated information for a candidate number until the page is reloaded. */
export function getFakeInfoForCandidate(
  candidateNumber: string,
  options: FakeInfoOptions = {}
): FakeInfo {
  const normalizedCandidateNumber = candidateNumber.trim();

  if (!normalizedCandidateNumber) {
    throw new RangeError('candidateNumber cannot be empty');
  }

  const existingInfo = candidateInfoByNumber.get(normalizedCandidateNumber);
  if (existingInfo) return existingInfo;

  const generatedInfo = generateFakeInfo(options);
  candidateInfoByNumber.set(normalizedCandidateNumber, generatedInfo);
  return generatedInfo;
}

/** Generate synthetic candidate information. */
export function generateFakeInfo(options: FakeInfoOptions = {}): FakeInfo {
  const random = options.random ?? Math.random;
  const minAge = options.minAge ?? DEFAULT_MIN_AGE;
  const maxAge = options.maxAge ?? DEFAULT_MAX_AGE;
  const birthday = randomBirthday(minAge, maxAge, random);
  const gender = randomGender(random);

  return {
    birthDate: formatBirthday(birthday),
    name: generateName(gender, random),
    identity: generateIdentityNumber(birthday.getUTCFullYear(), gender, random),
    address: CANDIDATE_ADDRESS
  };
}

function generateName(gender: Gender, random: RandomSource): string {
  const firstFamilyName = weightedRandomItem(nameData.familyNames, random).name;
  let familyName = firstFamilyName;

  if (randomUnit(random) < DEFAULT_DOUBLE_SURNAME_RATE) {
    const remainingFamilyNames = nameData.familyNames.filter(
      (entry) => entry.name !== firstFamilyName
    );
    familyName += ` ${weightedRandomItem(remainingFamilyNames, random).name}`;
  }

  const name = [
    familyName,
    randomItem(nameData[gender], random)
  ].join(' ');

  return name.toLocaleUpperCase('vi-VN');
}

function generateIdentityNumber(
  birthYear: number,
  gender: Gender,
  random: RandomSource
): string {
  const provinceCode = randomItem(VIETNAM_BIRTHPLACE_CODES, random);
  const centuryIndex = Math.floor(birthYear / 100) - 19;
  const centuryGenderCode = centuryIndex * 2 + (gender === 'female' ? 1 : 0);
  const yearCode = String(birthYear % 100).padStart(2, '0');
  const randomSequence = String(randomInteger(0, 999999, random)).padStart(6, '0');

  return `${provinceCode}${centuryGenderCode}${yearCode}${randomSequence}`;
}

function randomBirthday(minAge: number, maxAge: number, random: RandomSource): Date {
  assertAgeRange(minAge, maxAge);

  const today = new Date();
  const maximumSupportedAge = today.getFullYear() - EARLIEST_CCCD_BIRTH_YEAR;

  if (maxAge > maximumSupportedAge) {
    throw new RangeError(`maxAge cannot be greater than ${maximumSupportedAge}`);
  }

  const oldestPossibleBirthday = new Date(
    birthdayAtAge(today, maxAge + 1).getTime() + MILLISECONDS_PER_DAY
  );

  if (oldestPossibleBirthday.getUTCFullYear() < EARLIEST_CCCD_BIRTH_YEAR) {
    throw new RangeError(`maxAge must produce a birth year of ${EARLIEST_CCCD_BIRTH_YEAR} or later`);
  }

  // Descending weights make each younger age more likely than the next older age.
  const ages = Array.from(
    { length: maxAge - minAge + 1 },
    (_, index) => {
      const age = minAge + index;
      return {
        age,
        weight: maxAge - age + 1
      };
    }
  );
  const selectedAge = weightedRandomItem(ages, random).age;
  const latestBirthday = birthdayAtAge(today, selectedAge);
  const earliestBirthday = new Date(
    birthdayAtAge(today, selectedAge + 1).getTime() + MILLISECONDS_PER_DAY
  );

  const availableDays = Math.floor(
    (latestBirthday.getTime() - earliestBirthday.getTime()) / MILLISECONDS_PER_DAY
  );

  return new Date(
    earliestBirthday.getTime() +
    randomInteger(0, availableDays, random) * MILLISECONDS_PER_DAY
  );
}

/** Return the latest birthday for someone who has reached the given age today. */
function birthdayAtAge(today: Date, age: number): Date {
  const year = today.getFullYear() - age;
  const month = today.getMonth();
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(today.getDate(), lastDayOfMonth);

  return new Date(Date.UTC(year, month, day));
}

function assertAgeRange(minAge: number, maxAge: number): void {
  if (!Number.isInteger(minAge) || minAge < 0) {
    throw new RangeError('minAge must be a non-negative integer');
  }

  if (!Number.isInteger(maxAge) || maxAge < minAge) {
    throw new RangeError('maxAge must be an integer greater than or equal to minAge');
  }
}

function formatBirthday(birthday: Date): string {
  const day = String(birthday.getUTCDate()).padStart(2, '0');
  const month = String(birthday.getUTCMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${birthday.getUTCFullYear()}`;
}

function randomGender(random: RandomSource): Gender {
  return randomInteger(0, 1, random) === 0 ? 'male' : 'female';
}

function randomItem<T>(values: readonly T[], random: RandomSource): T {
  if (!values.length) {
    throw new RangeError('Cannot select a random item from an empty list');
  }

  return values[randomInteger(0, values.length - 1, random)];
}

function weightedRandomItem<T extends { weight: number }>(
  values: readonly T[],
  random: RandomSource
): T {
  if (!values.length) {
    throw new RangeError('Cannot select a weighted item from an empty list');
  }

  const totalWeight = values.reduce((total, entry) => total + entry.weight, 0);
  let target = randomUnit(random) * totalWeight;

  for (const entry of values) {
    target -= entry.weight;
    if (target < 0) return entry;
  }

  return values[values.length - 1]!;
}

function randomUnit(random: RandomSource): number {
  if (typeof random !== 'function') {
    throw new TypeError('random must be a function');
  }

  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('random must return a number from 0 (inclusive) to 1 (exclusive)');
  }

  return value;
}

function randomInteger(minimum: number, maximum: number, random: RandomSource): number {
  return Math.floor(randomUnit(random) * (maximum - minimum + 1)) + minimum;
}
