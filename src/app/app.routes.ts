import { Routes } from '@angular/router';
import { CategorySelectionComponent } from './features/category-selection/category-selection.component';
import { QuizConfigComponent } from './features/quiz-config/quiz-config.component';
import { QuizComponent } from './features/quiz/quiz.component';
import { ResultsComponent } from './features/results/results.component';
import { HistoryComponent } from './features/history/history.component';

export const routes: Routes = [
  { path: '', component: CategorySelectionComponent, title: 'Quiz - Select Category' },
  { path: 'config/:categoryId', component: QuizConfigComponent, title: 'Quiz - Configure' },
  { path: 'quiz', component: QuizComponent, title: 'Quiz - In Progress' },
  { path: 'results', component: ResultsComponent, title: 'Quiz - Results' },
  { path: 'history', component: HistoryComponent, title: 'Quiz - History' },
  // Redirection pour les chemins inconnus vers la page d'accueil
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
