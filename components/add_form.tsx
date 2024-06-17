import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AddForm({
  fieldId,
  placeholder,
  action,
}: {
  fieldId: string;
  placeholder: string;
  action: (text: string) => void;
}) {
  const [text, setText] = useState<string>('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  return (
    <div className='flex space-x-1 items-center pt-1 mt-1 border-t border-border max-w-full p-2 pb-1'>
      <input
        className='w-full h-8 text-sm px-2 focus:bg-muted hover:bg-muted focus-visible:outline-none focus-visible:ring-1 ring-ring rounded bg-background'
        type='text'
        placeholder={placeholder}
        id={fieldId}
        value={text}
        onChange={handleChange}
        required
      />
      <Button
        className='h-7 max-w-5'
        variant='outline'
        onClick={() => action(text)}
      >
        <i className='ph ph-plus'></i>
      </Button>
    </div>
  );
}
