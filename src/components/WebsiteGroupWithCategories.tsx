import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash, Edit2, Check, X, GripVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Website } from "../types";

interface AddWebsiteFormProps {
  websites: Website[];
  onAddWebsite: (url: string) => void;
  onRemoveWebsite: (id: string) => void;
  onUpdateWebsite?: (id: string, newUrl: string) => void;
  onReorderWebsites?: (websites: Website[]) => void;
}

export function WebsiteGroupWithCategories({ 
  websites, 
  onAddWebsite, 
  onRemoveWebsite,
  onUpdateWebsite,
  onReorderWebsites
}: AddWebsiteFormProps) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const editRef = useRef<HTMLDivElement>(null);

  // Handle click outside to save
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingId && editRef.current && !editRef.current.contains(event.target as Node)) {
        handleSaveEdit();
      }
    };

    if (editingId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId, editUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;

    onAddWebsite(websiteUrl.trim());
    setWebsiteUrl("");
  };

  const handleEdit = (website: Website) => {
    setEditingId(website.id);
    setEditUrl(website.url);
  };

  const handleSaveEdit = () => {
    if (onUpdateWebsite && editingId && editUrl.trim()) {
      onUpdateWebsite(editingId, editUrl.trim());
    }
    setEditingId(null);
    setEditUrl("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditUrl("");
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, websiteId: string) => {
    setDraggedId(websiteId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, websiteId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== websiteId) {
      setDragOverId(websiteId);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId && onReorderWebsites) {
      const draggedIndex = websites.findIndex(w => w.id === draggedId);
      const targetIndex = websites.findIndex(w => w.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newWebsites = [...websites];
        const [draggedWebsite] = newWebsites.splice(draggedIndex, 1);
        newWebsites.splice(targetIndex, 0, draggedWebsite);
        onReorderWebsites(newWebsites);
      }
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="space-y-4">
      {/* Add Website Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Website URL"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          required
          className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-400"
        />
        <Button type="submit" className="px-3 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={16} />
        </Button>
      </form>

      {/* Website List */}
      <div className="space-y-2 w-full">
        {websites.map((website) => (
          <div 
            key={website.id} 
            className={`flex items-center gap-2 transition-all duration-200 ${
              draggedId === website.id ? 'opacity-50' : ''
            } ${
              dragOverId === website.id ? 'bg-slate-700/50 rounded-md' : ''
            }`}
            draggable={editingId !== website.id}
            onDragStart={(e) => handleDragStart(e, website.id)}
            onDragOver={(e) => handleDragOver(e, website.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, website.id)}
          >
            {editingId === website.id ? (
              <div ref={editRef} className="flex items-center gap-2 w-full">
                <Input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="flex-1 bg-slate-800/50 border-slate-700 text-white focus:border-blue-400"
                />
                <Button 
                  size="icon" 
                  onClick={handleSaveEdit}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check size={16} />
                </Button>
                <Button 
                  size="icon" 
                  onClick={handleCancelEdit}
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <>
                <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-300">
                  <GripVertical size={16} />
                </div>
                <div 
                  className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-white cursor-pointer hover:bg-slate-800/70 transition-colors"
                  onClick={() => handleEdit(website)}
                >
                  {website.url}
                </div>
                <Button 
                  size="icon" 
                  onClick={() => handleEdit(website)}
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                >
                  <Edit2 size={16} />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => onRemoveWebsite(website.id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash size={16} />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
