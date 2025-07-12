// FILE: src/components/reports/AiSuggestions.jsx

'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function AiSuggestions({ reportData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState('');
  const [error, setError] = useState('');

  const getAiSuggestions = async () => {
    if (!reportData || typeof reportData.totalRevenue !== 'number' || typeof reportData.totalExpenses !== 'number') {
      setError("Report data is not available or invalid. Please wait for the report to load.");
      return;
    }
    
    setIsLoading(true);
    setSuggestions('');
    setError('');

    const prompt = `
      As a business analyst for a restaurant, analyze the following financial data and provide actionable suggestions.
      Focus on potential areas for cost savings, revenue growth, and improving profitability.

      Data:
      - Total Revenue: ${reportData.totalRevenue}
      - Total Expenses: ${reportData.totalExpenses}
      - Net Profit: ${reportData.totalRevenue - reportData.totalExpenses}

      Provide the suggestions in a clear, concise, and easy-to-understand format. Use markdown for formatting if possible.
    `;

    try {
      // FIX: Read the API key from the environment variables.
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
      }

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Gemini API Error:", result);
        throw new Error(result.error?.message || `API request failed with status ${response.status}`);
      }

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setSuggestions(text);
      } else {
        throw new Error("Received an invalid response from the API.");
      }

    } catch (err) {
      console.error("Error fetching AI suggestions:", err);
      setError(`Sorry, I couldn't generate suggestions. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="AI-Powered Suggestions">
      <NeumorphismButton
        onClick={getAiSuggestions}
        disabled={isLoading || !reportData}
        className="!text-secondary"
      >
        <Sparkles className="w-5 h-5" />
        <span>{isLoading ? 'Analyzing Data...' : 'Generate Suggestions'}</span>
      </NeumorphismButton>

      <div className="mt-4">
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          </div>
        )}
        {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>}
        {suggestions && (
          <div className="p-4 bg-neo-bg shadow-neo-inset rounded-lg text-sm text-gray-700 prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: suggestions.replace(/\n/g, '<br />') }} />
          </div>
        )}
      </div>
    </Card>
  );
}
