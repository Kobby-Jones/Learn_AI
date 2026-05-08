import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { DashboardLayout, PublicLayout } from '@/layouts/DashboardLayout'
import { ProtectedRoute } from './ProtectedRoute'

// Public pages
import LandingPage from '@/pages/public/LandingPage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterPage from '@/pages/public/RegisterPage'
import { AboutPage, FAQPage, ContactPage, ForgotPasswordPage } from '@/pages/public/OtherPages'

// Student pages
import StudentDashboard from '@/pages/student/StudentDashboard'
import { StartAssessmentPage, LiveAssessmentPage } from '@/pages/student/AssessmentPages'
import ResultsPage from '@/pages/student/ResultsPage'
import RecommendationsPage from '@/pages/student/RecommendationsPage'
import LibraryPage from '@/pages/student/LibraryPage'
import { ProgressPage, NotificationsPage } from '@/pages/student/ProgressNotifications'
import ProfilePage from '@/pages/student/ProfilePage'

// Teacher pages
import TeacherDashboard from '@/pages/teacher/TeacherDashboard'
import {
  StudentsPage, TeacherAnalyticsPage, ReportsPage,
  TeacherRecommendationsPage, ClassroomPage, TeacherProfilePage
} from '@/pages/teacher/TeacherPages'

// Admin pages
import {
  AdminDashboard, UsersPage, AssessmentsManagementPage, ContentPage,
  AdminAnalyticsPage, SystemPage, LogsPage, AdminSettingsPage
} from '@/pages/admin/AdminPages'

const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  // Student routes
  {
    path: '/student',
    element: <ProtectedRoute allowedRoles={['student']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/student/dashboard" replace /> },
          { path: 'dashboard', element: <StudentDashboard /> },
          { path: 'assessment', element: <StartAssessmentPage /> },
          { path: 'assessment/live', element: <LiveAssessmentPage /> },
          { path: 'results', element: <ResultsPage /> },
          { path: 'recommendations', element: <RecommendationsPage /> },
          { path: 'library', element: <LibraryPage /> },
          { path: 'progress', element: <ProgressPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },

  // Teacher routes
  {
    path: '/teacher',
    element: <ProtectedRoute allowedRoles={['teacher']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/teacher/dashboard" replace /> },
          { path: 'dashboard', element: <TeacherDashboard /> },
          { path: 'students', element: <StudentsPage /> },
          { path: 'analytics', element: <TeacherAnalyticsPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'recommendations', element: <TeacherRecommendationsPage /> },
          { path: 'classroom', element: <ClassroomPage /> },
          { path: 'profile', element: <TeacherProfilePage /> },
          { path: 'notifications', element: <NotificationsPage /> },
        ],
      },
    ],
  },

  // Admin routes
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'assessments', element: <AssessmentsManagementPage /> },
          { path: 'content', element: <ContentPage /> },
          { path: 'analytics', element: <AdminAnalyticsPage /> },
          { path: 'system', element: <SystemPage /> },
          { path: 'logs', element: <LogsPage /> },
          { path: 'settings', element: <AdminSettingsPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
        ],
      },
    ],
  },

  // Catch-all redirect
  { path: '*', element: <Navigate to="/" replace /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
