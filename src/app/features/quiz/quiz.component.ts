import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer, takeWhile, finalize } from 'rxjs';
import { TriviaService } from '../../core/services/trivia.service';
import { Question } from '../../core/models/question.model';
import { ShufflePipe } from '../../shared/pipes/shuffle.pipe';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, ShufflePipe],
  templateUrl: './quiz.component.html',
})
export class QuizComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private triviaService = inject(TriviaService);

  questions: Question[] = [];
  currentQuestionIndex = 0;
  score = 0;
  isLoading = true;
  error: string | null = null;
  selectedAnswer: string | null = null;
  answered = false;

  readonly questionTime = 20;
  timeLeft = this.questionTime;
  timerSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      const amount = params['amount'];
      const difficulty = params['difficulty'];

      if (!category || !amount || !difficulty) {
        this.error = 'Quiz configuration is missing. Please start again.';
        this.isLoading = false;

        setTimeout(() => this.router.navigate(['/']), 3000);
        return;
      }

      this.loadQuestions(+amount, +category, difficulty);
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  loadQuestions(amount: number, categoryId: number, difficulty: string): void {
    this.isLoading = true;
    this.error = null;
    this.triviaService.getQuestions(amount, categoryId, difficulty).subscribe({
      next: (questions) => {
        if (questions.length === 0) {
          this.error = "No questions found for this configuration. Try different settings.";
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/config', categoryId]), 3000);
          return;
        }
        this.questions = questions.map(q => ({
          ...q,

          all_answers: [...q.incorrect_answers, q.correct_answer]
        }));
        this.isLoading = false;
        this.startQuestionTimer();
      },
      error: (err) => {
        this.error = `Failed to load questions: ${err.message}. Please try again.`;
        this.isLoading = false;
        console.error(err);

        setTimeout(() => this.router.navigate(['/config', categoryId]), 3000);
      }
    });
  }

  startQuestionTimer(): void {
    this.stopTimer();
    this.timeLeft = this.questionTime;
    this.answered = false;
    this.selectedAnswer = null;
    this.timerSubscription = timer(0, 1000)
      .pipe(
        takeWhile(() => this.timeLeft > 0),
        finalize(() => {
          if (!this.answered && this.timeLeft <= 0) {
            this.handleTimeout();
          }
        })
      )
      .subscribe(() => {
        this.timeLeft--;
      });
  }

  handleTimeout(): void {
    if (!this.answered) { // Double vérification
      console.log("Time's up!");

      this.questions[this.currentQuestionIndex].user_answer = undefined;
      this.questions[this.currentQuestionIndex].is_correct = false;
      this.answered = true;

      setTimeout(() => this.nextQuestion(), 1500);
    }
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  selectAnswer(answer: string): void {
    if (this.answered) return;

    this.stopTimer();
    this.answered = true;
    this.selectedAnswer = answer;
    const currentQ = this.questions[this.currentQuestionIndex];
    currentQ.user_answer = answer;

    if (answer === currentQ.correct_answer) {
      this.score++;
      currentQ.is_correct = true;
    } else {
      currentQ.is_correct = false;
    }


    setTimeout(() => this.nextQuestion(), 1500);
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.startQuestionTimer();
    } else {

      this.navigateToResults();
    }
  }

  navigateToResults(): void {
    this.stopTimer();

    this.router.navigate(['/results'], {
      state: {
        score: this.score,
        totalQuestions: this.questions.length,
        answeredQuestions: this.questions
      }
    });
  }

  get currentQuestion(): Question | undefined {
    return this.questions?.[this.currentQuestionIndex];
  }

  getButtonClass(answer: string): string {
    if (!this.answered) {
      return 'bg-white hover:bg-indigo-100 text-indigo-700';
    }

    const isCorrect = answer === this.currentQuestion?.correct_answer;
    const isSelected = answer === this.selectedAnswer;

    if (isCorrect) {
      return 'bg-green-500 text-white scale-105';
    } else if (isSelected && !isCorrect) {
      return 'bg-red-500 text-white';
    } else {
      return 'bg-gray-300 text-gray-600 opacity-75 cursor-not-allowed';
    }
  }


  getTimerProgress(): number {
    return (this.timeLeft / this.questionTime) * 100;
  }
}
