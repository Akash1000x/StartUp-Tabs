import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash, Edit2, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Website } from "../types";

interface AddWebsiteFormProps {
  websites: Website[];
  onAddWebsite: (url: string) => void;
  onRemoveWebsite: (id: string) => void;
  onUpdateWebsite?: (id: string, newUrl: string) => void;
}

export function WebsiteGroupWithCategories({ 
  websites, 
  onAddWebsite, 
  onRemoveWebsite,
  onUpdateWebsite 
}: AddWebsiteFormProps) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
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
          <div key={website.id} className="flex items-center gap-2">
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
                <div 
                  className="w-full overflow-hidden text-ellipsis whitespace-nowrap bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-white cursor-pointer hover:bg-slate-800/70 transition-colors"
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
