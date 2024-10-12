// src/Notifications.js
import React, { useEffect, useState } from 'react';

const Notifications = () => {
  const [messages, setMessages] = useState([]);
  const uri = 'https://proyectodivisasapi-production.up.railway.app';
  useEffect(() => {
    let eventSource;

    const connect = () => {
      eventSource = new EventSource(uri + '/Alerta/notificacion/subscribe');

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
        setTimeout(() => {
          connect();
        }, 5000); // Intentar reconectar cada 5 segundos
      };
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>Notificaciones</h1>
      <ul style={{display:'flex', justifyContent:'space-around',flexWrap:'wrap'}}>
        {messages.map((msg, index) => (
          <li key={index}><pre>{JSON.stringify(msg, null, 2)}</pre></li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
