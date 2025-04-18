import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { TriviaService } from '../../core/services/trivia.service';
import { TriviaCategory } from '../../core/models/category.model';

@Component({
  selector: 'app-category-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-selection.component.html',
  styleUrls: ['./category-selection.component.scss'] // vide pour l'instant
})
export class CategorySelectionComponent implements OnInit {
  private triviaService = inject(TriviaService);
  private router = inject(Router);

  categories$!: Observable<TriviaCategory[]>;
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.categories$ = this.triviaService.getCategories();

    this.categories$.subscribe({
      next: () => this.isLoading = false,
      error: (err) => {
        this.error = 'Failed to load categories. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  selectCategory(categoryId: number): void {
    this.router.navigate(['/config', categoryId]);
  }
}
