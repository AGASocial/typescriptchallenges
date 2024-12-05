import { Challenge } from '../../types/challenge';

export const fibonacciChallenge: Challenge = {
  id: 'fibonacci',
  title: 'Fibonacci Number',
  description: 'Write a function that returns the nth number in the Fibonacci sequence. The sequence starts: 0, 1, 1, 2, 3, 5, 8, ...',
  initialCode: 'function fibonacci(n: number): number {\n  // Your code here\n}',
  testCases: [
    { input: [0], expected: 0 },
    { input: [1], expected: 1 },
    { input: [6], expected: 8 },
    { input: [8], expected: 21 }
  ],
  difficulty: 'medium'
};