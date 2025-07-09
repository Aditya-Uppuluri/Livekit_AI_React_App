import React, { useState, useEffect } from 'react';
import { Save, Download } from 'lucide-react';

interface NotesPanelProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  isInterviewActive: boolean;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  notes,
  onNotesChange,
  isInterviewActive,
}) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Track unsaved changes
  useEffect(() => {
    if (notes && notes !== '') {
      setHasUnsavedChanges(true);
    }
  }, [notes]);

  const handleSaveNotes = () => {
    // In a real app, you'd save to a backend here
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  };

  const handleExportNotes = () => {
    if (!notes) return;
    
    const element = document.createElement('a');
    const file = new Blob([notes], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `interview-notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveNotes}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              title="Save notes"
            >
              <Save className="w-4 h-4" />
            </button>
          )}
          {notes && (
            <button
              onClick={handleExportNotes}
              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              title="Export notes"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Take notes here..."
        className="w-full h-32 resize-none border border-gray-200 rounded-xl p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        disabled={!isInterviewActive}
      />
      
      {lastSaved && (
        <div className="mt-2 text-xs text-gray-500">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        {notes.length} characters
      </div>
    </div>
  );
};