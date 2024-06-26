'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [finalTheme, setFinalTheme] = useState<string>('light');

  useEffect(() => {
    if (resolvedTheme) setFinalTheme(resolvedTheme);
  }, [setFinalTheme, resolvedTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='w-11 h-11'
          title='Appearance'
        >
          {finalTheme === 'light' ? (
            <i className='ph ph-sun text-lg'></i>
          ) : (
            <i className='ph ph-moon text-lg'></i>
          )}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
