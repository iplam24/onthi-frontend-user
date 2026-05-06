import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ExamsView from '../views/ExamsView.vue';
import ExamAttemptView from '../views/ExamAttemptView.vue';
import AttemptsHistoryView from '../views/AttemptsHistoryView.vue';
import LearningView from '../views/LearningView.vue';
import PolicyView from '../views/PolicyView.vue';
import ContactView from '../views/ContactView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/exams',
      name: 'exams',
      component: ExamsView,
    },
    {
      path: '/exams/:examId/attempt',
      name: 'exam-attempt',
      component: ExamAttemptView,
      props: true,
    },
    {
      path: '/attempts/:id/review',
      name: 'exam-review',
      component: () => import('../views/ExamReviewView.vue'),
      props: true,
    },
    {
      path: '/attempts',
      name: 'attempts-history',
      component: AttemptsHistoryView,
    },
    {
      path: '/learning',
      name: 'learning',
      component: LearningView,
    },
    {
      path: '/policy',
      name: 'policy',
      component: PolicyView,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
    {
      path: '/evaluation',
      name: 'evaluation',
      component: () => import('../views/StudentEvaluationView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/math-test',
      name: 'math-test',
      component: () => import('../views/MathTest.vue'),
    },
  ],
});

export default router;
