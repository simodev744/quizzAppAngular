import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule pour <router-outlet>

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // Ajouter RouterModule ici
  template: `
    <main class="bg-gray-100 min-h-screen">
      <!-- Optionnel: Ajouter un header/navbar simple -->
      <nav class="bg-indigo-800 text-white p-4 shadow-md mb-4">
         <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-xl font-bold">Angular Trivia Quiz</h1>
            <div>
               <a routerLink="/" class="px-3 py-2 rounded hover:bg-indigo-700 transition">Home</a>
               <a routerLink="/history" class="px-3 py-2 rounded hover:bg-indigo-700 transition">History</a>
            </div>
         </div>
      </nav>
      <router-outlet></router-outlet>
      <!-- Optionnel: Ajouter un footer -->
      <footer class="text-center p-4 mt-8 text-gray-500 text-sm">
        Angular Quiz App © {{ currentYear }}
      </footer>
    </main>
  `,
  // styles: [] // Peut rester vide si les styles sont globaux ou dans les composants
})
export class AppComponent {
  title = 'angular-quiz-app';
  currentYear = new Date().getFullYear();
}
