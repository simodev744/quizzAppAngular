import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz-config',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Ajouter FormsModule
  templateUrl: './quiz-config.component.html',
})
export class QuizConfigComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categoryId!: number;
  numberOfQuestions: number = 10;
  difficulty: string = 'medium';
  difficulties: string[] = ['easy', 'medium', 'hard'];
  questionAmounts: number[] = [5, 10, 15, 20];

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('categoryId');
    if (idParam) {
      this.categoryId = +idParam; // Convertir en nombre
    } else {

      console.error('Category ID missing!');
      this.router.navigate(['/']); // Retour à la sélection
    }
  }

  startQuiz(): void {
    if (!this.categoryId) return;


    this.router.navigate(['/quiz'], {
      queryParams: {
        category: this.categoryId,
        amount: this.numberOfQuestions,
        difficulty: this.difficulty
      }
    });
  }
}
