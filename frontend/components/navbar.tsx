"use client"

import React, { useState, useEffect } from 'react';

export default function Navbar() {
    const [sessionData, setSessionData] = useState<any | null>(null);

    useEffect(() => {
        fetch('http://localhost:5000/session', {
            method: 'GET',
            credentials: 'include' // Include credentials (cookies) in the request
        })
            .then(response => response.json())
            .then(data => {
                setSessionData(data);
            })
            .catch(error => console.error('Error fetching session data:', error));
    }, []);

    return (
        <nav className="flex justify-between p-4 h-16 bg-slate-600">
            <div></div>
            {
                sessionData != null && sessionData.user ? <button onClick={() => { fetch('http://localhost:5000/auth/logout', { method: 'GET', credentials: 'include'} ) }}>Logout</button> :
                    <div className='flex gap-4'> <a href="/auth/login">login</a> <a href="/auth/register">sign up</a></div>
            }

        </nav>
    )

}
