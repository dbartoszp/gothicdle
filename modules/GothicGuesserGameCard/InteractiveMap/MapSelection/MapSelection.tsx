// MapSelection.tsx
'use client';

import { Button } from '@/modules/ui/Button/Button';
import { MAP_NAMES, MAP_PATHS } from '../../mapPaths/mapPaths';
import { useState } from 'react';

type MapSelectionProps = {
  onSelect: (mapPath: string) => void;
};

export const MapSelection = ({ onSelect }: MapSelectionProps) => {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const toggleGroup = (group: string) => {
    setExpandedGroup(expandedGroup === group ? null : group);
  };

  return (
    <div className='flex flex-row gap-x-4'>
      {Object.entries(MAP_PATHS).map(([group, maps]) => (
        <div key={group} className='relative flex flex-col gap-y-1'>
          <Button size='sm' width='w-36' onClick={() => toggleGroup(group)}>
            {group}
          </Button>

          {expandedGroup === group && (
            <div className='absolute left-0 top-full z-10 flex flex-col gap-y-1 border border-neutral-700 bg-neutral-950 p-1'>
              {maps.map((mapPath, idx) => (
                <Button
                  size='sm'
                  width='w-36'
                  key={mapPath}
                  onClick={() => onSelect(mapPath)}
                >
                  {MAP_NAMES[group]?.[idx] || mapPath}
                </Button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
