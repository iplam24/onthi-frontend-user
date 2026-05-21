import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '../views/HomeView.vue';
import ExamsView from '../views/ExamsView.vue';
import ExamAttemptView from '../views/ExamAttemptView.vue';
import AttemptsHistoryView from '../views/AttemptsHistoryView.vue';
import LearningView from '../views/LearningView.vue';
import PolicyView from '../views/PolicyView.vue';
import ContactView from '../views/ContactView.vue';
import PaymentSuccessView from '../views/PaymentSuccessView.vue';
import PaymentCancelView from '../views/PaymentCancelView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: 'smooth' };
  },
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
      meta: { requiresAuth: true },
    },
    {
      path: '/attempts/:id/review',
      name: 'exam-review',
      component: () => import('../views/ExamReviewView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/attempts',
      name: 'attempts-history',
      component: AttemptsHistoryView,
      meta: { requiresAuth: true },
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
      meta: { requiresAuth: true },
    },
    {
      path: '/exams/random',
      name: 'random-exam',
      component: () => import('../views/RandomExamView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/attempts/:attemptId/performance',
      name: 'attempt-performance',
      component: () => import('../views/PerformanceView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('../views/PricingView.vue'),
    },
    {
      path: '/ai-guide',
      name: 'ai-guide',
      component: () => import('../views/AiGuideView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/:userId',
      name: 'public-profile',
      component: () => import('../views/ProfileView.vue'),
      props: true,
    },
    {
      path: '/math-test',
      name: 'math-test',
      component: () => import('../views/MathTest.vue'),
    },
    {
      path: '/payment/success',
      name: 'payment-success',
      component: PaymentSuccessView,
      meta: { requiresAuth: true },
    },
    {
      path: '/payment/cancel',
      name: 'payment-cancel',
      component: () => import('../views/PaymentCancelView.vue'),
    },
    {
      path: '/deposit',
      name: 'deposit',
      component: () => import('../views/DepositView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/social',
      name: 'social',
      component: () => import('../views/SocialView.vue'),
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import('../views/MessagesView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard — redirect unauthenticated users from protected routes
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore();
    if (!auth.isAuthenticated) {
      // Redirect to home page — AuthPopover will handle login
      next({ name: 'home' });
      return;
    }
  }
  next();
});

export default router;
