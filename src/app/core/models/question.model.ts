export interface Question {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers?: string[];
  user_answer?: string;
  is_correct?: boolean;
}

export interface TriviaQuestionsResponse {
  response_code: number;
  results: Question[];
}
