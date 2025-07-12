import { User } from './authService';

export interface Answer {
  id: string;
  content: string;
  author: User;
  questionId: string;
  createdAt: string;
  updatedAt: string;
  voteCount: number;
  userVote?: 'up' | 'down' | null;
}

export interface CreateAnswerData {
  content: string;
  questionId: string;
}

class AnswerService {
  private mockAnswers: Answer[] = [
    {
      id: '1',
      content: '<p>For JWT authentication in React, I recommend storing the token in localStorage and creating an auth context. Here\'s a basic approach:</p><pre><code>// AuthContext.js\nconst AuthContext = createContext();\n\nexport const useAuth = () => {\n  return useContext(AuthContext);\n};</code></pre><p>Make sure to handle token expiration and refresh logic properly.</p>',
      author: {
        id: '5',
        email: 'expert@example.com',
        username: 'auth_expert',
        createdAt: '2024-01-01T00:00:00Z',
      },
      questionId: '1',
      createdAt: '2024-01-15T15:30:00Z',
      updatedAt: '2024-01-15T15:30:00Z',
      voteCount: 12,
      userVote: null,
    },
    {
      id: '2',
      content: '<p>I\'d also add that you should consider using httpOnly cookies for better security. LocalStorage is vulnerable to XSS attacks.</p><p>Another option is to use libraries like <code>react-query</code> or <code>swr</code> for better token management and automatic retries.</p>',
      author: {
        id: '6',
        email: 'security@example.com',
        username: 'security_pro',
        createdAt: '2024-01-02T00:00:00Z',
      },
      questionId: '1',
      createdAt: '2024-01-15T16:45:00Z',
      updatedAt: '2024-01-15T16:45:00Z',
      voteCount: 8,
      userVote: null,
    },
    {
      id: '3',
      content: '<p>For MongoDB schema design, it depends on your use case. For a Q&A platform, I\'d recommend keeping answers separate for better performance:</p><pre><code>// Question Schema\n{\n  _id: ObjectId,\n  title: String,\n  description: String,\n  author: ObjectId,\n  tags: [String],\n  createdAt: Date\n}\n\n// Answer Schema\n{\n  _id: ObjectId,\n  content: String,\n  questionId: ObjectId,\n  author: ObjectId,\n  createdAt: Date\n}</code></pre>',
      author: {
        id: '7',
        email: 'mongo@example.com',
        username: 'mongo_master',
        createdAt: '2024-01-03T00:00:00Z',
      },
      questionId: '2',
      createdAt: '2024-01-14T17:30:00Z',
      updatedAt: '2024-01-14T17:30:00Z',
      voteCount: 15,
      userVote: null,
    },
  ];

  // Mock get answers for question
  async getAnswersByQuestionId(questionId: string): Promise<Answer[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const answers = this.mockAnswers
          .filter(answer => answer.questionId === questionId)
          .sort((a, b) => b.voteCount - a.voteCount); // Sort by vote count
        resolve(answers);
      }, 400);
    });
  }

  // Mock create answer
  async createAnswer(answerData: CreateAnswerData): Promise<Answer> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const newAnswer: Answer = {
          id: Date.now().toString(),
          content: answerData.content,
          author: currentUser,
          questionId: answerData.questionId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          voteCount: 0,
          userVote: null,
        };
        this.mockAnswers.push(newAnswer);
        resolve(newAnswer);
      }, 600);
    });
  }

  // Mock vote on answer
  async voteAnswer(answerId: string, voteType: 'up' | 'down'): Promise<Answer> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const answerIndex = this.mockAnswers.findIndex(a => a.id === answerId);
        if (answerIndex === -1) {
          reject(new Error('Answer not found'));
          return;
        }

        const answer = this.mockAnswers[answerIndex];
        const previousVote = answer.userVote;
        
        // Update vote count
        if (previousVote === voteType) {
          // Remove vote
          answer.userVote = null;
          answer.voteCount += voteType === 'up' ? -1 : 1;
        } else if (previousVote === null) {
          // Add new vote
          answer.userVote = voteType;
          answer.voteCount += voteType === 'up' ? 1 : -1;
        } else {
          // Change vote
          answer.userVote = voteType;
          answer.voteCount += voteType === 'up' ? 2 : -2;
        }

        resolve(answer);
      }, 300);
    });
  }
}

export default new AnswerService();