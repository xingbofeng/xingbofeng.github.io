import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/m-plus-rounded-1c';
import 'animal-island-ui/style';
import './animal-blog.less';
import App from './App.jsx';

createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
