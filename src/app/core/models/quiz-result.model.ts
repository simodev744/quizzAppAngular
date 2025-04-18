import {Question} from './question.model';

export interface QuizResult {
  name: string;
  score: number;
  totalQuestions: number;
  category: string; // Optionnel: Pourrait être utile d'afficher la catégorie dans l'historique
  difficulty: string; // Optionnel
  date: number; // Timestamp
  answeredQuestions?: Question[]; // Pour revue détaillée (optionnel)
}
