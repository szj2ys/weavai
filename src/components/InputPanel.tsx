"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Panel, PanelHeader, PanelContent } from "./Panel";

interface InputPanelProps {
  onGenerate: (description: string) => void;
  isLoading: boolean;
}

export function InputPanel({ onGenerate, isLoading }: InputPanelProps) {
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && !isLoading) {
      onGenerate(description.trim());
    }
  };

  const examples = [
    "User registration and login process",
    "E-commerce order processing workflow",
    "Software development lifecycle",
    "Customer service handling process",
    "Data backup and recovery process",
  ];

  return (
    <Panel className="h-fit">
      <PanelHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">
            Describe Your Process
          </h2>
        </div>
      </PanelHeader>

      <PanelContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the flowchart you want to generate in detail, for example: user registration process, including filling in information, email verification, account activation and other steps..."
              className="w-full h-32 px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={!description.trim() || isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Send className="h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Flowchart"}
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Example Processes:
          </h3>
          <div className="space-y-1">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setDescription(example)}
                disabled={isLoading}
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-accent-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </PanelContent>
    </Panel>
  );
}
