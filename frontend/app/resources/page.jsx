'use client';

import ResourceCard from '@/components/resource_card';
import { useState, useEffect } from 'react';

export default function Resources() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/resource/')
      .then((response) => response.json())
      .then((data) => setResources(data))
      .catch((error) => console.error('Error fetching resources:', error));
  }, []);

  return (
    <>
      <a href='resources/new'>NEW</a>
      <div className='grid grid-cols-3 p-5 gap-5'>
        {resources.map((resource) => (
          <>
            <ResourceCard
              id={resource._id}
              title={resource.title}
              description={resource.description}
              documentType={resource.documentType}
              documentFormat={resource.file.split('.').pop()}
              username={resource.username}
              hashtags={[resource.hashtags]}
              subject={{
                id: 'cg',
                name: resource.subject,
              }}
              course={{
                id: 'lei',
                name: resource.course,
              }}
              createdAt={new Date()}
            />
          </>
        ))}
      </div>
    </>
  );
}
