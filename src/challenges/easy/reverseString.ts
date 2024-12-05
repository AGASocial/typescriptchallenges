import { Challenge } from '../../types/challenge';

export const reverseStringChallenge: Challenge = {
  id: 'reverse-string',
  title: 'Reverse String',
  description: 'Write a function that reverses a string.',
  initialCode: 'function reverse(str: string): string {\n  // Your code here\n}',
  testCases: [
    { input: ['hello'], expected: 'olleh' },
    { input: ['typescript'], expected: 'tpircsepyt' },
    { input: [''], expected: '' },
    { input: ['12345'], expected: '54321' }
  ],
  difficulty: 'easy'
};