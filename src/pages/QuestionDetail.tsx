import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, MessageSquare, Clock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import questionService, { Question } from '../services/questionService';
import answerService, { Answer } from '../services/answerService';
import Navbar from '../components/Navbar';
import RichTextEditor from '../components/RichTextEditor';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadQuestionAndAnswers();
    }
  }, [id]);

  const loadQuestionAndAnswers = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [questionData, answersData] = await Promise.all([
        questionService.getQuestionById(id),
        answerService.getAnswersByQuestionId(id)
      ]);
      
      setQuestion(questionData);
      setAnswers(answersData);
    } catch (error) {
      toast({
        title: "Error loading question",
        description: "Failed to load the question details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoteQuestion = async (voteType: 'up' | 'down') => {
    if (!question || !isAuthenticated) return;
    
    try {
      const updatedQuestion = await questionService.voteQuestion(question.id, voteType);
      setQuestion(updatedQuestion);
    } catch (error) {
      toast({
        title: "Vote failed",
        description: "Failed to register your vote.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answerContent.trim() || answerContent === '<p><br></p>') return;

    setSubmitting(true);
    try {
      const newAnswer = await answerService.createAnswer({
        content: answerContent,
        questionId: question.id,
      });
      setAnswers([...answers, newAnswer]);
      setAnswerContent('');
      toast({
        title: "Answer posted!",
        description: "Your answer has been submitted.",
      });
    } catch (error) {
      toast({
        title: "Failed to post answer",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Question not found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Question */}
        <Card className="card-shadow mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoteQuestion('up')}
                  className={`vote-button ${question.userVote === 'up' ? 'active' : ''}`}
                  disabled={!isAuthenticated}
                >
                  <ChevronUp className="w-6 h-6" />
                </Button>
                <span className="text-lg font-semibold">{question.voteCount}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoteQuestion('down')}
                  className={`vote-button ${question.userVote === 'down' ? 'active' : ''}`}
                  disabled={!isAuthenticated}
                >
                  <ChevronDown className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
                <div 
                  className="prose prose-sm max-w-none mb-4"
                  dangerouslySetInnerHTML={{ __html: question.description }}
                />
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Asked by {question.author.username} • {new Date(question.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          
          {answers.map((answer) => (
            <Card key={answer.id} className="card-shadow mb-4">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Button variant="ghost" size="sm" className="vote-button">
                      <ChevronUp className="w-5 h-5" />
                    </Button>
                    <span className="font-semibold">{answer.voteCount}</span>
                    <Button variant="ghost" size="sm" className="vote-button">
                      <ChevronDown className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div 
                      className="prose prose-sm max-w-none mb-4"
                      dangerouslySetInnerHTML={{ __html: answer.content }}
                    />
                    <div className="text-sm text-muted-foreground">
                      Answered by {answer.author.username} • {new Date(answer.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Answer Form */}
        {isAuthenticated ? (
          <Card className="card-shadow">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
              <form onSubmit={handleSubmitAnswer}>
                <RichTextEditor
                  value={answerContent}
                  onChange={setAnswerContent}
                  placeholder="Write your answer here..."
                  disabled={submitting}
                />
                <div className="mt-4 flex justify-end">
                  <Button type="submit" className="brand-gradient" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Post Answer'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="card-shadow">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">Please log in to post an answer</p>
              <Button onClick={() => navigate('/login')}>Login</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;