import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import questionService from '../services/questionService';
import Navbar from '../components/Navbar';
import RichTextEditor from '../components/RichTextEditor';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { X, Loader2, HelpCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AskQuestion: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleDescriptionChange = (value: string) => {
    setFormData({ ...formData, description: value });
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag) && formData.tags.length < 5) {
      setFormData({
        ...formData,
        tags: [...formData.tags, trimmedTag],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your question.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim() || formData.description === '<p><br></p>') {
      toast({
        title: "Description required",
        description: "Please provide a description for your question.",
        variant: "destructive",
      });
      return;
    }

    if (formData.tags.length === 0) {
      toast({
        title: "Tags required",
        description: "Please add at least one tag to help categorize your question.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const question = await questionService.createQuestion({
        title: formData.title.trim(),
        description: formData.description,
        tags: formData.tags,
      });

      toast({
        title: "Question posted!",
        description: "Your question has been successfully posted.",
        variant: "default",
      });

      navigate(`/question/${question.id}`);
    } catch (error) {
      toast({
        title: "Failed to post question",
        description: "There was an error posting your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Ask a Question</h1>
          <p className="text-muted-foreground">
            Get help from the community by asking a detailed question
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Question Details</CardTitle>
                <CardDescription>
                  Be specific and imagine you're asking a question to another person
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="e.g., How to implement JWT authentication in React?"
                      maxLength={150}
                      disabled={loading}
                    />
                    <p className="text-sm text-muted-foreground">
                      Be specific and clear. {formData.title.length}/150 characters
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label>
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      placeholder="Provide details about your question. Include what you've tried and what specific help you need..."
                      disabled={loading}
                    />
                    <p className="text-sm text-muted-foreground">
                      Include all the information someone would need to answer your question
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags">
                      Tags <span className="text-destructive">*</span>
                    </Label>
                    <div className="space-y-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagInputKeyPress}
                        onBlur={addTag}
                        placeholder="e.g., react, javascript, node.js (press Enter or comma to add)"
                        disabled={loading || formData.tags.length >= 5}
                      />
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-muted-foreground hover:text-foreground"
                              disabled={loading}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add up to 5 tags to describe your question. {formData.tags.length}/5 tags
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="brand-gradient"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        'Post Question'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Tips */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Tips for asking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm">Search first</h4>
                  <p className="text-sm text-muted-foreground">
                    Make sure your question hasn't been asked before
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Be specific</h4>
                  <p className="text-sm text-muted-foreground">
                    Include exact error messages, code snippets, and expected behavior
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Show effort</h4>
                  <p className="text-sm text-muted-foreground">
                    Explain what you've tried and why it didn't work
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Use proper tags</h4>
                  <p className="text-sm text-muted-foreground">
                    Tag your question with relevant technologies
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Question quality matters</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Well-formatted questions with clear descriptions and relevant tags 
                  are more likely to get helpful answers quickly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;