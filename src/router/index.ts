import { createRouter, createWebHistory } from 'vue-router';
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
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionsView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
    },
  ],
});

export default router;
