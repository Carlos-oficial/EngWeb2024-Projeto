"use client"

import React, { useState, useEffect } from 'react';
interface UserData {
    username: string;
    // Add other fields as needed
}

export default function Session() {
    const [userData, setUserData] = useState<any | null>(null);

    useEffect(() => {
        fetch('http://localhost:5000/session', {
            method: 'GET',
            credentials: 'include' // Include credentials (cookies) in the request
        })
            .then(response => response.json())
            .then(data => {
                setUserData(data);
            })
            .catch(error => console.error('Error fetching session data:', error));
    }, []);

    return (
    <div className=' flex flex-col items-center '>
        <div className='p-4 text-3xl font-bold rounded-lg mx-auto'>
        
        <h1 className=''>Session storage</h1>
        </div>
        <div>

            {userData ? Object.entries(userData).map(([key, value]) => {
                return (
                    <p>{key}:{JSON.stringify(value)}</p>
                )
            }) : <p>Loading ...</p>
            }
        </div>
    </div>

    );
}

