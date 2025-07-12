import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import questionService, { Question } from '../services/questionService';
import QuestionCard from '../components/QuestionCard';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const allQuestions = await questionService.getAllQuestions();
      setQuestions(allQuestions);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to{' '}
            <span className="brand-gradient bg-clip-text text-transparent">
              StackIt
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            The developer community where you can ask questions, share knowledge, and learn from experts.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="brand-gradient text-white font-medium">
                <Link to="/register">
                  <Plus className="w-5 h-5 mr-2" />
                  Join the Community
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search questions by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg card-shadow text-center">
            <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">{questions.length}</h3>
            <p className="text-muted-foreground">Questions Asked</p>
          </div>
          <div className="bg-card p-6 rounded-lg card-shadow text-center">
            <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">
              {questions.reduce((sum, q) => sum + q.answerCount, 0)}
            </h3>
            <p className="text-muted-foreground">Answers Given</p>
          </div>
          <div className="bg-card p-6 rounded-lg card-shadow text-center">
            <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">24/7</h3>
            <p className="text-muted-foreground">Community Support</p>
          </div>
        </div>

        {/* Questions Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground">
            Latest Questions
          </h2>
          {isAuthenticated && (
            <Button asChild className="brand-gradient">
              <Link to="/ask">
                <Plus className="w-4 h-4 mr-2" />
                Ask Question
              </Link>
            </Button>
          )}
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading questions...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm ? 'No questions found' : 'No questions yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or browse all questions.'
                : 'Be the first to ask a question and help build the community!'
              }
            </p>
            {isAuthenticated && !searchTerm && (
              <Button asChild className="brand-gradient">
                <Link to="/ask">
                  <Plus className="w-4 h-4 mr-2" />
                  Ask First Question
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQuestions.map((question, index) => (
              <div
                key={question.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <QuestionCard question={question} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;