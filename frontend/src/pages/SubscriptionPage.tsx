import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Crown, Check, Sparkles, Infinity, Zap, ArrowRight } from 'lucide-react';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { useUserStore } from '@/stores/useUserStore';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types/subscription';

export default function SubscriptionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();
  const {
    plans,
    currentSubscription,
    isLoading,
    isRedirecting,
    fetchPlans,
    fetchCurrentSubscription,
    startCheckout,
    openCustomerPortal,
  } = useSubscriptionStore();

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchPlans();
    if (isAuthenticated) {
      fetchCurrentSubscription();
    }
  }, [fetchPlans, fetchCurrentSubscription, isAuthenticated]);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      setStatusMessage({ type: 'success', text: 'Payment successful! Your plan has been upgraded.' });
      if (isAuthenticated) fetchCurrentSubscription();
      window.history.replaceState({}, '', '/subscription');
    } else if (canceled === 'true') {
      setStatusMessage({ type: 'info', text: 'Payment was canceled. You can try again anytime.' });
      window.history.replaceState({}, '', '/subscription');
    }
  }, [searchParams, isAuthenticated, fetchCurrentSubscription]);

  const handleCheckout = (priceId: string) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/subscription`);
      return;
    }
    startCheckout(priceId).catch(() => {
      setStatusMessage({ type: 'error', text: 'Failed to start checkout. Please try again.' });
    });
  };

  const handleManageSubscription = () => {
    openCustomerPortal();
  };

  const currentTier = currentSubscription?.tier || 'free';
  const isRedirectingPrice = isRedirecting;

  return (
    <div className="min-h-screen bg-snowdrift">
      {/* Header */}
      <div className="bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border-b border-[hsl(var(--border)/0.4)]">
        <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            &larr; Back to iDrip
          </Link>
          <p className="text-overline mb-2">
            PRICING<span className="text-[hsl(var(--punctuation))]">.</span>
          </p>
          <h1 className="text-display text-4xl md:text-5xl text-[hsl(var(--peak))] mb-2">
            Choose Your Plan
          </h1>
          <p className="text-base text-muted-foreground max-w-md">
            Unlock the full power of AI-powered styling<span className="text-[hsl(var(--punctuation))]">.</span>
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-12">
        {/* Status message */}
        {statusMessage && (
          <div
            className={cn(
              'p-4 rounded-2xl text-sm font-medium',
              statusMessage.type === 'success' &&
                'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800',
              statusMessage.type === 'info' &&
                'bg-[hsl(var(--frost))] text-foreground border border-[hsl(var(--border)/0.4)]',
              statusMessage.type === 'error' &&
                'bg-[hsl(var(--punctuation)/0.08)] text-[hsl(var(--punctuation))] border border-[hsl(var(--punctuation)/0.3)]'
            )}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Current plan banner (if authenticated and has paid plan) */}
        {isAuthenticated && currentTier !== 'free' && (
          <div className="p-5 rounded-2xl bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--glacier)/0.3)]">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-[hsl(var(--glacier))]" />
                <div>
                  <p className="text-sm font-semibold capitalize">
                    You&apos;re on the {currentTier} plan
                  </p>
                  {currentSubscription?.status && currentSubscription.status !== 'active' && (
                    <p className="text-xs text-muted-foreground">
                      Status: {currentSubscription.status}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleManageSubscription}
                className="px-4 py-2 rounded-xl border border-[hsl(var(--border)/0.4)] text-sm font-medium hover:bg-[hsl(var(--frost))] transition-colors"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        )}

        {/* Plan cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-[hsl(var(--frost)/0.4)] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentTier={currentTier}
                isAuthenticated={isAuthenticated}
                isRedirecting={isRedirectingPrice}
                onSelect={handleCheckout}
                onManage={handleManageSubscription}
              />
            ))}
          </div>
        )}

        {/* Feature comparison */}
        <section>
          <h2 className="text-xl font-bold mb-6">Feature Comparison</h2>
          <div className="rounded-2xl bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--border)/0.4)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[hsl(var(--border)/0.4)]">
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground">Feature</th>
                    <th className="px-6 py-4 font-medium text-center">Free</th>
                    <th className="px-6 py-4 font-medium text-center">Pro</th>
                    <th className="px-6 py-4 font-medium text-center">Lifetime</th>
                  </tr>
                </thead>
                <tbody>
                  <ComparisonRow label="Wardrobe items" free="20" pro="Unlimited" lifetime="Unlimited" />
                  <ComparisonRow
                    label="AI outfit generations"
                    free="5 / month"
                    pro="Unlimited"
                    lifetime="Unlimited"
                  />
                  <ComparisonRow label="Shopping recommendations" free="Basic" pro="Advanced" lifetime="Advanced" />
                  <ComparisonRow label="Priority AI processing" free="—" pro={<Check className="w-4 h-4 mx-auto" />} lifetime={<Check className="w-4 h-4 mx-auto" />} />
                  <ComparisonRow label="Premium support" free="—" pro="—" lifetime={<Check className="w-4 h-4 mx-auto" />} />
                  <ComparisonRow label="Future premium features" free="—" pro={<Check className="w-4 h-4 mx-auto" />} lifetime={<Check className="w-4 h-4 mx-auto" />} />
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-12">
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FaqCard
              question="Can I switch plans later?"
              answer="Yes! You can upgrade or switch between Pro Monthly and Pro Yearly anytime via the Stripe Customer Portal. Your billing will be prorated."
            />
            <FaqCard
              question="What happens when my subscription ends?"
              answer="If you cancel Pro, you'll revert to the Free plan at the end of your billing period. Your wardrobe data is preserved — you just won't be able to add new items beyond 20."
            />
            <FaqCard
              question="Is the Lifetime plan really forever?"
              answer="Yes! One payment of $199 gives you lifetime access to all current and future premium features. No recurring charges, ever."
            />
            <FaqCard
              question="Can I get a refund?"
              answer="Pro subscriptions can be canceled anytime and you'll keep access until the end of the billing period. Lifetime purchases have a 30-day money-back guarantee."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  currentTier,
  isAuthenticated,
  isRedirecting,
  onSelect,
  onManage,
}: {
  plan: Plan;
  currentTier: string;
  isAuthenticated: boolean;
  isRedirecting: boolean;
  onSelect: (priceId: string) => void;
  onManage: () => void;
}) {
  const isCurrentPlan =
    plan.id === currentTier ||
    (plan.id === 'pro_monthly' && currentTier === 'pro') ||
    (plan.id === 'pro_yearly' && currentTier === 'pro');

  const isFree = plan.id === 'free';
  const isLifetime = plan.id === 'lifetime';
  const isProYearly = plan.id === 'pro_yearly';

  const savingsPercent = isProYearly ? Math.round((1 - 89.99 / (9.99 * 12)) * 100) : 0;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl p-6 transition-all duration-200',
        plan.highlighted
          ? 'bg-[hsl(var(--frost)/0.9)] backdrop-blur-xl border-2 border-[hsl(var(--glacier))] shadow-lg shadow-[hsl(var(--glacier)/0.1)]'
          : 'bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--border)/0.4)] hover:border-[hsl(var(--glacier)/0.3)]'
      )}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[hsl(var(--glacier))] text-white text-xs font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Recommended
        </div>
      )}

      <div className="flex-1 space-y-5">
        {/* Name + icon */}
        <div className="flex items-center gap-2">
          {isFree && <Zap className="w-5 h-5 text-muted-foreground" />}
          {!isFree && !isLifetime && <Crown className="w-5 h-5 text-[hsl(var(--glacier))]" />}
          {isLifetime && <Infinity className="w-5 h-5 text-[hsl(var(--glacier))]" />}
          <h3 className="text-lg font-bold">{plan.name}</h3>
        </div>

        {/* Price */}
        <div>
          {plan.price === 0 ? (
            <div className="text-3xl font-bold">Free</div>
          ) : (
            <div>
              <span className="text-3xl font-bold">
                ${plan.price.toFixed(plan.price % 1 === 0 ? 0 : 2)}
              </span>
              {plan.interval && (
                <span className="text-sm text-muted-foreground">/{plan.interval}</span>
              )}
            </div>
          )}
          {isProYearly && (
            <p className="text-xs text-[hsl(var(--glacier))] mt-0.5 font-medium">
              Save {savingsPercent}% vs monthly
            </p>
          )}
          {isLifetime && (
            <p className="text-xs text-muted-foreground mt-0.5">One-time payment</p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-[hsl(var(--glacier))]" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-6">
        {isCurrentPlan && isAuthenticated ? (
          isFree ? (
            <p className="w-full py-2.5 text-center rounded-xl bg-[hsl(var(--frost))] text-sm font-medium text-muted-foreground">
              Current Plan
            </p>
          ) : (
            <button
              onClick={onManage}
              className="w-full py-2.5 rounded-xl border border-[hsl(var(--glacier)/0.3)] text-[hsl(var(--glacier))] text-sm font-medium hover:bg-[hsl(var(--glacier)/0.06)] transition-colors"
            >
              Manage Subscription
            </button>
          )
        ) : isFree ? (
          <p className="w-full py-2.5 text-center rounded-xl bg-[hsl(var(--frost))] text-sm font-medium text-muted-foreground">
            Included with sign up
          </p>
        ) : (
          <button
            onClick={() => onSelect(plan.stripePriceId!)}
            disabled={isRedirecting}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
              plan.highlighted
                ? 'bg-[hsl(var(--glacier))] text-white shadow-[0_4px_16px_-2px_hsl(var(--glacier)/0.35)] hover:opacity-90'
                : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-85',
              isRedirecting && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isRedirecting ? 'Redirecting...' : isLifetime ? 'Get Lifetime Access' : 'Upgrade'}
            {!isRedirecting && <ArrowRight className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  free,
  pro,
  lifetime,
}: {
  label: string;
  free: React.ReactNode;
  pro: React.ReactNode;
  lifetime: React.ReactNode;
}) {
  return (
    <tr className="border-b border-[hsl(var(--border)/0.3)]">
      <td className="px-6 py-3.5 text-muted-foreground">{label}</td>
      <td className="px-6 py-3.5 text-center">{free}</td>
      <td className="px-6 py-3.5 text-center bg-[hsl(var(--glacier)/0.04)]">{pro}</td>
      <td className="px-6 py-3.5 text-center">{lifetime}</td>
    </tr>
  );
}

function FaqCard({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-5 rounded-2xl bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--border)/0.4)]">
      <h3 className="text-sm font-semibold mb-2">{question}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
    </div>
  );
}
