import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Quiz, Question, Attempt, AttemptRequest, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AssesmentService {
  private readonly BASE = `${environment.apiBaseUrl}/api/v1/assesments`;

  constructor(private http: HttpClient) {}

  // ── Quiz CRUD ──
  getQuizzesByCourse(courseId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.BASE}/course/${courseId}`);
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.BASE}/${id}`);
  }

  createQuiz(quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.post<Quiz>(this.BASE, quiz);
  }

  updateQuiz(id: number, quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.BASE}/${id}`, quiz);
  }

  deleteQuiz(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.BASE}/${id}`);
  }

  // ── Questions ──
  getQuestionsByQuiz(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.BASE}/${quizId}/questions`);
  }

  addQuestion(quizId: number, question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`${this.BASE}/${quizId}/questions`, question);
  }

  updateQuestion(quizId: number, questionId: number, question: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${this.BASE}/${quizId}/questions/${questionId}`, question);
  }

  deleteQuestion(quizId: number, questionId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.BASE}/${quizId}/questions/${questionId}`);
  }

  // ── Attempts ──
  submitAttempt(req: AttemptRequest): Observable<Attempt> {
    return this.http.post<Attempt>(`${this.BASE}/attempt`, req);
  }

  getMyAttempts(quizId: number): Observable<Attempt[]> {
    return this.http.get<Attempt[]>(`${this.BASE}/${quizId}/attempts/my`);
  }

  getAttemptById(id: number): Observable<Attempt> {
    return this.http.get<Attempt>(`${this.BASE}/attempts/${id}`);
  }

  getAllAttempts(courseId: number): Observable<Attempt[]> {
    return this.http.get<Attempt[]>(`${this.BASE}/course/${courseId}/attempts`);
  }
}
