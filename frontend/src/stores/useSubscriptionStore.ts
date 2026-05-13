import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Plan, CurrentSubscription } from '@/types/subscription';
import { subscriptionService } from '@/services/subscriptionService';

interface SubscriptionState {
  plans: Plan[];
  currentSubscription: CurrentSubscription | null;
  isLoading: boolean;
  isRedirecting: boolean;

  fetchPlans: () => Promise<void>;
  fetchCurrentSubscription: () => Promise<void>;
  startCheckout: (priceId: string) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plans: [],
      currentSubscription: null,
      isLoading: false,
      isRedirecting: false,

      fetchPlans: async () => {
        set({ isLoading: true });
        try {
          const data = await subscriptionService.getPlans();
          set({ plans: data.plans });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchCurrentSubscription: async () => {
        const token = localStorage.getItem('idrip-token');
        if (!token) return;

        try {
          const sub = await subscriptionService.getCurrent();
          set({ currentSubscription: sub });
        } catch {
          // Keep existing state on error
        }
      },

      startCheckout: async (priceId: string) => {
        set({ isRedirecting: true });
        try {
          const { url } = await subscriptionService.createCheckoutSession(priceId);
          window.location.href = url;
        } catch (err) {
          set({ isRedirecting: false });
          throw err;
        }
      },

      openCustomerPortal: async () => {
        try {
          const { url } = await subscriptionService.createPortalSession();
          window.location.href = url;
        } catch (err) {
          console.error('Failed to open portal:', err);
        }
      },

      reset: () => {
        set({ currentSubscription: null, plans: [] });
      },
    }),
    {
      name: 'idrip-subscription',
      partialize: (state) => ({
        currentSubscription: state.currentSubscription,
        plans: state.plans,
      }),
    }
  )
);
