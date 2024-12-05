export interface Challenge {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  testCases: TestCase[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TestCase {
  input: any[];
  expected: any;
}

export interface TestCaseResult {
  input: any[];
  expected: any;
  actual: any;
  passed: boolean;
}

export interface ChallengeResult {
  success: boolean;
  timeSpent: number;
  testResults: TestCaseResult[];
  errorMessage?: string;
}