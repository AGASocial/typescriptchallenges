import { Challenge, ChallengeResult, TestCaseResult } from '../types/challenge';
import { transformCode } from '../utils/codeTransformer';

export class ChallengeValidator {
  static async validateSolution(
    challenge: Challenge,
    userCode: string
  ): Promise<ChallengeResult> {
    try {
      // Transform TypeScript code to JavaScript
      const processedCode = transformCode(userCode);
      
      // Create a safe evaluation context
      const createFunction = new Function(`
        "use strict";
        return (${processedCode});
      `);
      
      // Get the function
      const fn = createFunction();
      
      if (typeof fn !== 'function') {
        throw new Error('Submitted code must be a function');
      }

      // Run all test cases
      const testResults: TestCaseResult[] = [];
      let allPassed = true;

      for (const testCase of challenge.testCases) {
        const actual = fn(...testCase.input);
        const passed = JSON.stringify(actual) === JSON.stringify(testCase.expected);
        
        testResults.push({
          input: testCase.input,
          expected: testCase.expected,
          actual,
          passed
        });

        if (!passed) {
          allPassed = false;
        }
      }

      return {
        success: allPassed,
        timeSpent: 0,
        testResults
      };
    } catch (error) {
      return {
        success: false,
        timeSpent: 0,
        testResults: [],
        errorMessage: error instanceof Error 
          ? `Error: ${error.message}` 
          : 'Unknown error occurred'
      };
    }
  }
}