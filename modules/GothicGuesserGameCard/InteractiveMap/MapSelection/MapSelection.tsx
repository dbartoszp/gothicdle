'use client';

import { Button } from '@/modules/ui/Button/Button';
import { MAPS } from '../../mapPaths/mapPaths';
import { useState } from 'react';
import { Text } from '@/modules/ui/Text/Text';

type MapSelectionProps = {
  onSelect: (mapPath: string) => void;
};

export const MapSelection = ({ onSelect }: MapSelectionProps) => {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const toggleGroup = (group: string) => {
    setExpandedGroup(expandedGroup === group ? null : group);
  };

  return (
    <>
      <Text variant='subtitle'>Wybor mapy:</Text>
      <div className='flex flex-row justify-center gap-x-4 pt-6'>
        {Object.entries(MAPS).map(([groupKey, group]) => (
          <div key={groupKey} className='relative flex flex-col gap-y-1'>
            <Button
              size='sm'
              width='w-36'
              onClick={() => toggleGroup(groupKey)}
            >
              {group.name}
            </Button>

            {expandedGroup === groupKey && (
              <div className='absolute left-0 top-full z-10 flex flex-col gap-y-1 border border-neutral-700 bg-neutral-950 p-1'>
                {group.maps.map((map) => (
                  <Button
                    size='sm'
                    width='w-36'
                    key={map.path}
                    onClick={() => onSelect(map.path)}
                  >
                    {map.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
