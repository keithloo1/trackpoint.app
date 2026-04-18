
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const ViewToggle = ({ viewMode, setViewMode }) => {
  const handleValueChange = (value) => {
    if (value) {
      setViewMode(value);
      localStorage.setItem('clientViewMode', value);
    }
  };

  return (
    <ToggleGroup type="single" value={viewMode} onValueChange={handleValueChange} className="bg-white border rounded-md p-1">
      <ToggleGroupItem value="regular" aria-label="Regular View" className="px-3 py-1.5 h-auto data-[state=on]:bg-primary/10 data-[state=on]:text-primary">
        <LayoutGrid className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">Regular</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="compact" aria-label="Compact View" className="px-3 py-1.5 h-auto data-[state=on]:bg-primary/10 data-[state=on]:text-primary">
        <List className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">Compact</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
