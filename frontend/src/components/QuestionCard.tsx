import React from 'react';
import { Link } from 'react-router-dom';
import { Question } from '../services/questionService';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MessageSquare, ChevronUp, Clock, User } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <Card className="card-shadow hover:hover-shadow transition-all duration-200 hover:scale-[1.01] animate-fade-in">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote Count */}
          <div className="flex flex-col items-center space-y-1 min-w-[60px]">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <ChevronUp className="w-4 h-4" />
              <span className="text-sm font-medium">{question.voteCount}</span>
            </div>
            <span className="text-xs text-muted-foreground">votes</span>
          </div>

          {/* Answer Count */}
          <div className="flex flex-col items-center space-y-1 min-w-[60px]">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">{question.answerCount}</span>
            </div>
            <span className="text-xs text-muted-foreground">answers</span>
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <Link
              to={`/question/${question.id}`}
              className="block group"
            >
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                {question.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {stripHtml(question.description)}
              </p>
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs px-2 py-1 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Author and Date */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3" />
                <span className="font-medium">{question.author.username}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>asked {formatDate(question.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;