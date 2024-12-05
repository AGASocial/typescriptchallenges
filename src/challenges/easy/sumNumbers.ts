import { Challenge } from '../../types/challenge';

export const sumNumbersChallenge: Challenge = {
  id: 'sum-numbers',
  title: 'Sum Two Numbers',
  description: 'Write a function that takes two numbers and returns their sum.',
  initialCode: 'function sum(a: number, b: number): number {\n  // Your code here\n}',
  testCases: [
    { input: [1, 2], expected: 3 },
    { input: [-1, 1], expected: 0 },
    { input: [0, 0], expected: 0 },
    { input: [10, 20], expected: 30 }
  ],
  difficulty: 'easy'
};