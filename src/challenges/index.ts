import { sumNumbersChallenge } from './easy/sumNumbers';
import { reverseStringChallenge } from './easy/reverseString';
import { palindromeCheckChallenge } from './medium/palindromeCheck';
import { fibonacciChallenge } from './medium/fibonacci';
import { Challenge } from '../types/challenge';

// Export all challenges
export const challenges: Challenge[] = [
  sumNumbersChallenge,
  reverseStringChallenge,
  palindromeCheckChallenge,
  fibonacciChallenge
];