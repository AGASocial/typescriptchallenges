import { Challenge } from '../../types/challenge';

export const palindromeCheckChallenge: Challenge = {
  id: 'palindrome-check',
  title: 'Palindrome Check',
  description: 'Write a function that checks if a string is a palindrome (reads the same forwards and backwards). Ignore spaces and case sensitivity.',
  initialCode: 'function isPalindrome(str: string): boolean {\n  // Your code here\n}',
  testCases: [
    { input: ['A man a plan a canal Panama'], expected: true },
    { input: ['race a car'], expected: false },
    { input: ['Was it a car or a cat I saw'], expected: true },
    { input: ['hello'], expected: false }
  ],
  difficulty: 'medium'
};