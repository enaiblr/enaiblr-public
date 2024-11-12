import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface CustomSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyUp?: (e: React.KeyboardEvent) => void;
  className?: string;
  placeholder?: string;
  onClear?: () => void;
}

const CustomSearchInput = ({ 
  value, 
  onChange, 
  onKeyUp, 
  className = "", 
  placeholder = "",
  onClear 
}: CustomSearchInputProps) => {
  const prefix = "AI Tools for ";
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [inputValue, setInputValue] = useState(value.startsWith(prefix) ? value.slice(prefix.length) : value);

  useEffect(() => {
    const newValue = value.startsWith(prefix) ? value.slice(prefix.length) : value;
    setInputValue(newValue);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(prefix + newValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    onChange(prefix);
    if (onClear) onClear();
  };

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          className={`pl-[10rem] pr-9 flex items-center ${className}`}
          value={inputValue}
          onChange={handleChange}
          onKeyUp={onKeyUp}
          placeholder={placeholder}
          style={{ 
            fontSize: 'inherit',
            lineHeight: 'inherit',
            paddingTop: 0,
            paddingBottom: 0,
            minHeight: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        />
        <div 
          className="absolute left-10 top-0 bottom-0 flex items-center pointer-events-none text-foreground"
          style={{ 
            fontSize: 'inherit',
            lineHeight: 'inherit'
          }}
        >
          {prefix}
        </div>
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomSearchInput;