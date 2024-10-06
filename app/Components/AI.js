import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const AIChat = ({ selectedPlanet }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const askQuestion = async () => {
        try {
            setLoading(true);
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API);
            console.log(process.env.NEXT_PUBLIC_Google_API)
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are an AI assistant called ExoBot specializing in exoplanets.
                The user is asking about ${selectedPlanet}.
                Please provide a concise and informative answer to the following question: ${question}`;
            const result = await model.generateContent(prompt);
            setAnswer(result.response.text());
            setQuestion('');

        } catch (error) {
            console.error('Error:', error);
            setAnswer('Sorry, there was an error processing your question. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim()) {
            askQuestion();
        }
    };

    return (
        <div className="fixed bottom-4  z-10 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg">
            <Button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 rounded-t-lg bg-primary text-primary-foreground"
            >
                <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Ask ExoBot about {selectedPlanet}</span>
                </div>
                {isExpanded ? (
                    <ChevronDown className="h-5 w-5" />
                ) : (
                    <ChevronUp className="h-5 w-5" />
                )}
            </Button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-[500px] p-4' : 'max-h-0'
            }`}>
                <div className="flex flex-col gap-4">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder='Ask a question about this Planet...'
                            className="flex-1"
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Ask'
                            )}
                        </Button>
                    </form>
                    
                    {answer && (
                        <div className="answer bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Answer:</h4>
                            <p className="text-sm text-slate-700">{answer}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIChat;