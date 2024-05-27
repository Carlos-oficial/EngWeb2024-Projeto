'use client';

import { Input } from '@/components/ui/input';

import ResourceCard from '@/components/resource_card';

export default function Resources() {
  // TODO: fetch resources from API, getting only a set amount at a time to implement pagination

  return (
    <div className='flex h-full'>
      <div className='p-5 space-y-3'>
        <Input type='text' placeholder='Search any resource...' />
        <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
          <ResourceCard
            id='1'
            title='Teste 1 - CG 23/24'
            description='Teste da época normal com resolução.'
            documentType='Teste'
            documentFormat='PDF'
            username='diogogmatos'
            hashtags={['#lei', '#cg', '#teste']}
            subject={{
              id: 'cg',
              name: 'Computação Gráfica',
            }}
            course={{
              id: 'lei',
              name: 'Licenciatura em Engenharia Informática',
            }}
            createdAt={new Date()}
          />
        </div>
      </div>
      <div className='w-80 border-l border-border'></div>
    </div>
  );
}
