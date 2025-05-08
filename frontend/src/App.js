import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import TaskCreatePage from './pages/TaskCreatePage';
import TaskEditPage from './pages/TaskEditPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './components/PrivateRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Header />
          <main className="py-3">
            <Container>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/tasks" 
                  element={
                    <PrivateRoute>
                      <TaskListPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/tasks/create" 
                  element={
                    <PrivateRoute>
                      <TaskCreatePage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/tasks/:id" 
                  element={
                    <PrivateRoute>
                      <TaskDetailPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/tasks/:id/edit" 
                  element={
                    <PrivateRoute>
                      <TaskEditPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  } 
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Container>
          </main>
          <Footer />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App; 