import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/sign-up';
import SignIn from './components/sign-in';
import Tasks from './components/tasks';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/your-tasks' element={<Tasks />} />
      </Routes>
    </Router>
  );
};

export default App;
