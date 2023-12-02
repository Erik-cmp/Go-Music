"use client"

import React, { useState, useEffect } from 'react';

interface GreetingProps {  
}

const Greeting: React.FC<GreetingProps> = () => {
  const [greeting, setGreeting] = useState<string>("Welcome Back");

  useEffect(() => {    
    const getTimeOfDay = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        return "Good Morning";
      } else if (hour >= 12 && hour < 18) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    };

    const intervalId = setInterval(() => {
      setGreeting(getTimeOfDay());
    }, 60000);
    
    setGreeting(getTimeOfDay());
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <h1 className="text-white md:text-4xl text-3xl font-bold">
      {greeting}
    </h1>
  );
};

export default Greeting;
