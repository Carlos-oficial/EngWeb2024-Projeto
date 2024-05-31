'use client';

import { Input } from '@/components/ui/input';
import ResourceCard from '@/components/resource_card';
import { useState } from 'react';

export default function Resources() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    // Perform form submission logic here, e.g., send a POST request to the server
    formData.append('username', 'diogogmatos');
    fetch('http://localhost:5000/resource/', {
      method: 'POST',
      body: formData,
    }); // TODO: get username from session
  };
  return (
    <form onSubmit={handleSubmit} encType='multipart/form-data'>
      <div>
        <label htmlFor='title'>Title:</label>
        <input type='text' id='title' name='title' required />
      </div>
      <div>
        <label htmlFor='file'>File:</label>
        <input type='file' id='file' name='file' required />
      </div>
      <div>
        <label htmlFor='description'>Description:</label>
        <textarea id='description' name='description' required></textarea>
      </div>
      <div>
        <label htmlFor='documentType'>Document Type:</label>
        <input type='text' id='documentType' name='documentType' required />
      </div>
      <div>
        <label htmlFor='hashtags'>Hashtags (comma-separated):</label>
        <input type='text' id='hashtags' name='hashtags' required />
      </div>
      <div>
        <label htmlFor='subject'>Subject:</label>
        <input type='text' id='subject' name='subject' required />
      </div>
      <div>
        <label htmlFor='course'>Course:</label>
        <input type='text' id='course' name='course' required />
      </div>
      <button type='submit'>Create Resource</button>
    </form>
  );
}
