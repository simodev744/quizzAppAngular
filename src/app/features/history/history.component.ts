import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { QuizResult } from '../../core/models/quiz-result.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
  private router = inject(Router);
  history: QuizResult[] = [];

  readonly STORAGE_KEY = 'quizHistory';

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    console.log('Loading history in HistoryComponent...');
    try {
      const historyJson = localStorage.getItem(this.STORAGE_KEY);
      console.log('Raw data from localStorage:', historyJson);
      if (historyJson) {
        this.history = JSON.parse(historyJson);

        this.history.sort((a, b) => b.date - a.date);
        console.log('Parsed and sorted history:', this.history); // LOG DE DEBUG
      } else {
        this.history = [];
        console.log('No history found in localStorage.'); // LOG DE DEBUG
      }
    } catch (error) {
      console.error('Failed to load or parse history from localStorage:', error);
      this.history = [];
    }
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to clear the entire quiz history? This cannot be undone.')) {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
        this.history = [];
        console.log('History cleared.');
      } catch (error) {
        console.error('Failed to clear history from localStorage:', error);
        alert('Could not clear history due to a storage error.');
      }
    }
  }
}
