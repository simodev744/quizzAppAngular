import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { TriviaCategoriesResponse, TriviaCategory } from '../models/category.model';
import { Question, TriviaQuestionsResponse } from '../models/question.model';
import * as he from 'he'; // Importer la bibliothèque de décodage

@Injectable({
  providedIn: 'root'
})
export class TriviaService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://opentdb.com/';

  getCategories(): Observable<TriviaCategory[]> {
    return this.http.get<TriviaCategoriesResponse>(`${this.API_URL}api_category.php`)
      .pipe(
        map(response => response.trivia_categories)
      );
  }

  getQuestions(amount: number, categoryId: number, difficulty: string): Observable<Question[]> {
    let params = new HttpParams()
      .set('amount', amount.toString())
      .set('category', categoryId.toString())
      .set('difficulty', difficulty.toLowerCase())
      .set('type', 'multiple'); // Forcer les questions à choix multiples pour la cohérence

    return this.http.get<TriviaQuestionsResponse>(`${this.API_URL}api.php`, { params })
      .pipe(
        map(response => {
          if (response.response_code !== 0) {
            // Gérer les erreurs de l'API (par exemple, pas assez de questions pour les paramètres)
            throw new Error(`API Error Code: ${response.response_code}`);
          }
          return response.results.map(question => this.decodeQuestion(question));
        })
      );
  }

  // Fonction pour décoder les entités HTML dans les questions et réponses
  private decodeQuestion(question: Question): Question {
    return {
      ...question,
      question: he.decode(question.question),
      correct_answer: he.decode(question.correct_answer),
      incorrect_answers: question.incorrect_answers.map(answer => he.decode(answer))
    };
  }
}
