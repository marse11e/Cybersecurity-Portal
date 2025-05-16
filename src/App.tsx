import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailsPage from './pages/ArticleDetailsPage';
import TestsPage from './pages/TestsPage';
import TestDetailsPage from './pages/TestDetailsPage';
import ForumPage from './pages/ForumPage';
import DiscussionDetailsPage from './pages/DiscussionDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Main Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:id" element={<CourseDetailsPage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/:id" element={<ArticleDetailsPage />} />
          <Route path="tests" element={<TestsPage />} />
          <Route path="tests/:id" element={<TestDetailsPage />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="forum/:id" element={<DiscussionDetailsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  );

  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    />
  );
}

export default App;