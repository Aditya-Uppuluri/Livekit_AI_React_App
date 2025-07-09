import React from 'react';
import { Users, HelpCircle } from 'lucide-react';

interface InterviewHeaderProps {
  showCompletionNav?: boolean;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({ 
  showCompletionNav = false 
}) => {
  const navItems = showCompletionNav 
    ? ['Dashboard', 'Interviews', 'Candidates', 'Resources']
    : ['Dashboard', 'Interviews', 'Candidates', 'Templates'];

  return (
    <header className="flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">InterviewAI</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <a 
              key={item}
              href="#" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
        
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
      </div>
    </header>
  );
};