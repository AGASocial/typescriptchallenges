export class Timer {
  private startTime: number = 0;
  private endTime: number = 0;
  private isRunning: boolean = false;

  start(): void {
    this.startTime = Date.now();
    this.isRunning = true;
  }

  stop(): number {
    if (!this.isRunning) return 0;
    
    this.endTime = Date.now();
    this.isRunning = false;
    return this.getTimeSpent();
  }

  getTimeSpent(): number {
    return Math.floor((this.endTime - this.startTime) / 1000);
  }

  getStartTime(): number {
    return this.startTime;
  }

  reset(): void {
    this.startTime = 0;
    this.endTime = 0;
    this.isRunning = false;
  }
}