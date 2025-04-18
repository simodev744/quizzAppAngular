import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Pour ngModel
import { Question } from '../../core/models/question.model';
import { QuizResult } from '../../core/models/quiz-result.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './results.component.html',
})
export class ResultsComponent implements OnInit {
  private router = inject(Router);

  score: number = 0;
  totalQuestions: number = 0;
  answeredQuestions: Question[] = [];
  playerName: string = '';
  resultsSaved: boolean = false;
  showDetails: boolean = false;

  readonly STORAGE_KEY = 'quizHistory';

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      score: number;
      totalQuestions: number;
      answeredQuestions: Question[];
    };

    if (state) {
      this.score = state.score;
      this.totalQuestions = state.totalQuestions;
      this.answeredQuestions = state.answeredQuestions || [];
    } else {

      console.warn('Results state not found, redirecting to home.');
      this.router.navigate(['/']);
    }
  }

  saveResult(): void {
    if (!this.playerName.trim()) {
      alert('Please enter your name!');
      return;
    }

    const newResult: QuizResult = {
      name: this.playerName.trim(),
      score: this.score,
      totalQuestions: this.totalQuestions,
      // On pourrait récupérer category/difficulty depuis le state si on les passait depuis QuizComponent
      category: this.answeredQuestions[0]?.category || 'Unknown', // Exemple basique
      difficulty: this.answeredQuestions[0]?.difficulty || 'Unknown', // Exemple basique
      date: Date.now()
      // Ne pas stocker answeredQuestions dans localStorage par défaut pour éviter de trop grossir,
      // mais on pourrait si une revue détaillée depuis l'historique est souhaitée.
    };

    try {
      const history = this.loadHistory();
      history.push(newResult);
      history.sort((a, b) => b.date - a.date);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      this.resultsSaved = true;
    } catch (error) {
      console.error('Failed to save results to localStorage:', error);
      alert('Could not save your score due to a storage error.');
    }
  }

  loadHistory(): QuizResult[] {
    const historyJson = localStorage.getItem(this.STORAGE_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  }

  getCorrectAnswersCount(): number {
    return this.answeredQuestions.filter(q => q.is_correct).length;
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
