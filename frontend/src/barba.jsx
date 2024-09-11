import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import barba from '@barba/core';

const initBarba = () => {
  barba.init({
    transitions: [
      {
        name: 'fade',
        leave(data) {
          return new Promise(resolve => {
            const done = () => resolve();
            // Add your leave transition logic here
            // Example: fade out effect
            const oldContent = data.current.container;
            oldContent.style.transition = 'opacity 0.5s';
            oldContent.style.opacity = 0;
            oldContent.addEventListener('transitionend', done, { once: true });
          });
        },
        enter(data) {
          return new Promise(resolve => {
            const done = () => resolve();
            // Add your enter transition logic here
            // Example: fade in effect
            const newContent = data.next.container;
            newContent.style.opacity = 0;
            setTimeout(() => {
              newContent.style.transition = 'opacity 0.5s';
              newContent.style.opacity = 1;
            }, 0);
            newContent.addEventListener('transitionend', done, { once: true });
          });
        }
      }
    ]
  });
};

const renderApp = () => {
  ReactDOM.render(
    <Router>
      <App />
    </Router>,
    document.getElementById('root')
  );
};

initBarba();
renderApp();