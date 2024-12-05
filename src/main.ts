import './style.css';
import { Challenge, TestCase, TestCaseResult } from './types/challenge';
import { challenges } from './challenges';
import { ChallengeValidator } from './services/challengeValidator';
import { Timer } from './components/Timer';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

class CodingChallengeApp {
  private currentChallengeIndex: number = 0;
  private timer: Timer;
  private editor: EditorView | null = null;
  private timerInterval: number | null = null;
  private challengeCompleted: boolean = false;
  private hasStartedTyping: boolean = false;

  constructor() {
    this.timer = new Timer();
    this.initializeUI();
  }

  private get currentChallenge(): Challenge {
    return challenges[this.currentChallengeIndex];
  }

  private formatTestCase(testCase: TestCase): string {
    const inputs = testCase.input.map(input => JSON.stringify(input)).join(', ');
    const expected = JSON.stringify(testCase.expected);
    return `Input: (${inputs}) → Expected: ${expected}`;
  }

  private formatTestResult(result: TestCaseResult): string {
    const inputs = result.input.map(input => JSON.stringify(input)).join(', ');
    const expected = JSON.stringify(result.expected);
    const actual = JSON.stringify(result.actual);
    const status = result.passed ? '✓' : '✗';
    const statusClass = result.passed ? 'test-passed' : 'test-failed';
    
    return `
      <li class="test-case ${statusClass}">
        <span class="test-status">${status}</span>
        <div class="test-details">
          <div>Input: (${inputs})</div>
          <div>Expected: ${expected}</div>
          ${!result.passed ? `<div>Actual: ${actual}</div>` : ''}
        </div>
      </li>
    `;
  }

  private renderTestCases(): string {
    return `
      <div class="test-cases">
        <h3>Test Cases:</h3>
        <ul>
          ${this.currentChallenge.testCases.map(testCase => 
            `<li class="test-case">
              <span class="test-status pending">○</span>
              <div class="test-details">${this.formatTestCase(testCase)}</div>
            </li>`
          ).join('')}
        </ul>
      </div>
    `;
  }

  private updateTestResults(results: TestCaseResult[]): void {
    const testList = document.querySelector('.test-cases ul');
    if (testList) {
      testList.innerHTML = results.map(result => this.formatTestResult(result)).join('');
    }
  }

  private updateTimer(): void {
    const timerElement = document.querySelector<HTMLDivElement>('.timer');
    if (timerElement) {
      const elapsed = this.challengeCompleted 
        ? this.timer.getTimeSpent()
        : Math.floor((Date.now() - this.timer.getStartTime()) / 1000);
      timerElement.textContent = `Time: ${elapsed}s`;
    }
  }

  private initializeUI(): void {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    app.innerHTML = `
      <div class="challenge-container">
        <div class="challenge-navigation">
          <button id="prevChallenge" ${this.currentChallengeIndex === 0 ? 'disabled' : ''}>Previous</button>
          <span class="challenge-counter">Challenge ${this.currentChallengeIndex + 1}/${challenges.length}</span>
          <button id="nextChallenge" ${this.currentChallengeIndex === challenges.length - 1 ? 'disabled' : ''}>Next</button>
        </div>
        <div class="challenge-header">
          <h1>${this.currentChallenge.title}</h1>
          <span class="difficulty ${this.currentChallenge.difficulty}">${this.currentChallenge.difficulty}</span>
        </div>
        <p class="challenge-description">${this.currentChallenge.description}</p>
        ${this.renderTestCases()}
        <div class="timer">Time: 0s</div>
        <div id="editor" class="editor-container"></div>
        <div class="button-container">
          <button id="submit">Test Solution</button>
          <button id="reset">Reset</button>
        </div>
        <div id="result" class="result"></div>
      </div>
    `;

    this.setupEditor();
    this.setupEventListeners();
  }

  private setupEditor(): void {
    const editorElement = document.getElementById('editor')!;
    
    this.editor = new EditorView({
      doc: this.currentChallenge.initialCode,
      extensions: [
        basicSetup, 
        javascript(), 
        oneDark,
        EditorView.updateListener.of(update => {
          if (update.docChanged && !this.hasStartedTyping && !this.challengeCompleted) {
            this.hasStartedTyping = true;
            this.startChallenge();
          }
        })
      ],
      parent: editorElement
    });
  }

  private startChallenge(): void {
    this.challengeCompleted = false;
    this.timer.start();
    const submitButton = document.querySelector<HTMLButtonElement>('#submit')!;
    const resetButton = document.querySelector<HTMLButtonElement>('#reset')!;
    const resultElement = document.querySelector<HTMLDivElement>('#result')!;

    submitButton.disabled = false;
    resetButton.disabled = false;
    resultElement.textContent = '';
    resultElement.className = 'result';
    
    this.timerInterval = window.setInterval(() => this.updateTimer(), 1000);
  }

  private setupEventListeners(): void {
    const submitButton = document.querySelector<HTMLButtonElement>('#submit')!;
    const resetButton = document.querySelector<HTMLButtonElement>('#reset')!;
    const prevButton = document.querySelector<HTMLButtonElement>('#prevChallenge')!;
    const nextButton = document.querySelector<HTMLButtonElement>('#nextChallenge')!;
    const resultElement = document.querySelector<HTMLDivElement>('#result')!;

    prevButton.addEventListener('click', () => {
      if (this.currentChallengeIndex > 0) {
        this.currentChallengeIndex--;
        this.resetChallenge();
        this.initializeUI();
      }
    });

    nextButton.addEventListener('click', () => {
      if (this.currentChallengeIndex < challenges.length - 1) {
        this.currentChallengeIndex++;
        this.resetChallenge();
        this.initializeUI();
      }
    });

    submitButton.addEventListener('click', async () => {
      const result = await ChallengeValidator.validateSolution(
        this.currentChallenge,
        this.editor?.state.doc.toString() || ''
      );

      this.updateTestResults(result.testResults);

      resultElement.className = `result ${result.success ? 'success' : 'error'}`;
      if (result.success && !this.challengeCompleted) {
        this.challengeCompleted = true;
        const finalTime = this.timer.stop();
        this.updateTimer();
        resultElement.textContent = `Congratulations! All tests passed in ${finalTime} seconds!`;
      } else if (result.success) {
        resultElement.textContent = `All tests passed! Your first successful solution took ${this.timer.getTimeSpent()} seconds.`;
      } else if (result.errorMessage) {
        resultElement.textContent = result.errorMessage;
      } else {
        resultElement.textContent = 'Some tests failed. Keep trying!';
      }
    });

    resetButton.addEventListener('click', () => {
      this.resetChallenge();
      this.initializeUI();
    });
  }

  private resetChallenge(): void {
    this.timer.reset();
    this.challengeCompleted = false;
    this.hasStartedTyping = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}

new CodingChallengeApp();