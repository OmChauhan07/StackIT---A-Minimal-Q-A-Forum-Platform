import { User } from './authService';

export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: User;
  createdAt: string;
  updatedAt: string;
  voteCount: number;
  answerCount: number;
  userVote?: 'up' | 'down' | null;
}

export interface CreateQuestionData {
  title: string;
  description: string;
  tags: string[];
}

class QuestionService {
  private mockQuestions: Question[] = [
    {
      id: '1',
      title: 'How to implement JWT authentication in React?',
      description: '<p>I\'m building a React application and need to implement JWT authentication. What\'s the best approach for storing and managing tokens?</p>',
      tags: ['react', 'jwt', 'authentication'],
      author: {
        id: '2',
        email: 'john@example.com',
        username: 'john_dev',
        createdAt: '2024-01-10T10:00:00Z',
      },
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      voteCount: 15,
      answerCount: 3,
      userVote: null,
    },
    {
      id: '2',
      title: 'Best practices for MongoDB schema design?',
      description: '<p>I\'m designing a MongoDB schema for a Q&A platform. Should I embed answers in questions or keep them separate?</p>',
      tags: ['mongodb', 'database', 'schema'],
      author: {
        id: '3',
        email: 'sarah@example.com',
        username: 'sarah_db',
        createdAt: '2024-01-08T09:00:00Z',
      },
      createdAt: '2024-01-14T16:45:00Z',
      updatedAt: '2024-01-14T16:45:00Z',
      voteCount: 8,
      answerCount: 2,
      userVote: null,
    },
    {
      id: '3',
      title: 'Express.js middleware for error handling',
      description: '<p>What\'s the proper way to handle errors in Express.js middleware? I keep getting unhandled promise rejections.</p>',
      tags: ['express', 'nodejs', 'error-handling'],
      author: {
        id: '4',
        email: 'mike@example.com',
        username: 'mike_backend',
        createdAt: '2024-01-05T11:30:00Z',
      },
      createdAt: '2024-01-13T12:20:00Z',
      updatedAt: '2024-01-13T12:20:00Z',
      voteCount: 22,
      answerCount: 5,
      userVote: null,
    },
  ];

  // Mock get all questions
  async getAllQuestions(): Promise<Question[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.mockQuestions].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }, 500);
    });
  }

  // Mock get question by ID
  async getQuestionById(id: string): Promise<Question | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const question = this.mockQuestions.find(q => q.id === id);
        resolve(question || null);
      }, 300);
    });
  }

  // Mock create question
  async createQuestion(questionData: CreateQuestionData): Promise<Question> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const newQuestion: Question = {
          id: Date.now().toString(),
          title: questionData.title,
          description: questionData.description,
          tags: questionData.tags,
          author: currentUser,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          voteCount: 0,
          answerCount: 0,
          userVote: null,
        };
        this.mockQuestions.unshift(newQuestion);
        resolve(newQuestion);
      }, 800);
    });
  }

  // Mock vote on question
  async voteQuestion(questionId: string, voteType: 'up' | 'down'): Promise<Question> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const questionIndex = this.mockQuestions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) {
          reject(new Error('Question not found'));
          return;
        }

        const question = this.mockQuestions[questionIndex];
        const previousVote = question.userVote;
        
        // Update vote count
        if (previousVote === voteType) {
          // Remove vote
          question.userVote = null;
          question.voteCount += voteType === 'up' ? -1 : 1;
        } else if (previousVote === null) {
          // Add new vote
          question.userVote = voteType;
          question.voteCount += voteType === 'up' ? 1 : -1;
        } else {
          // Change vote
          question.userVote = voteType;
          question.voteCount += voteType === 'up' ? 2 : -2;
        }

        resolve(question);
      }, 300);
    });
  }
}

export default new QuestionService();