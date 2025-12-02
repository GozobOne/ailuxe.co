import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TagAutocomplete({ value, onChange, placeholder = "Add tags (comma-separated)" }: TagAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get all existing tags
  const { data: allTags } = trpc.contacts.getAllTags.useQuery();

  // Parse current tags
  const currentTags = value ? value.split(',').map((t) => t.trim()).filter(Boolean) : [];

  // Filter suggestions based on input
  const suggestions = allTags?.filter((tag) =>
    tag.toLowerCase().includes(inputValue.toLowerCase()) &&
    !currentTags.includes(tag)
  ) || [];

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          addTag(suggestions[selectedIndex]);
        } else if (inputValue.trim()) {
          addTag(inputValue.trim());
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      case ",":
        e.preventDefault();
        if (inputValue.trim()) {
          addTag(inputValue.trim());
        }
        break;
    }
  };

  // Add tag
  const addTag = (tag: string) => {
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(', ');
      onChange(newTags);
    }
    setInputValue("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    const newTags = currentTags.filter((t) => t !== tagToRemove).join(', ');
    onChange(newTags);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setShowSuggestions(val.length > 0);
    setSelectedIndex(-1);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2">
      {/* Current Tags */}
      {currentTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input with Autocomplete */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(inputValue.length > 0)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto"
          >
            {suggestions.map((tag, index) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors ${
                  index === selectedIndex ? "bg-accent" : ""
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Type to search existing tags or add new ones. Press Enter or comma to add.
      </p>
    </div>
  );
}
