<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ProcessSubscriptionPayments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:process-payments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process subscription payments and update next payment dates';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Processing subscription payments...');

        // Get subscriptions with payments due tomorrow
        $tomorrow = now()->addDay()->toDateString();
        $upcomingSubscriptions = \App\Models\Subscription::where('is_active', true)
            ->where('next_payment_date', $tomorrow)
            ->get();

        $this->info("Found {$upcomingSubscriptions->count()} subscriptions due tomorrow.");

        foreach ($upcomingSubscriptions as $subscription) {
            // TODO: Send notification to user (email/push)
            $this->info("Notification would be sent for: {$subscription->name}");
        }

        // Get subscriptions with payments that have passed
        $today = now()->toDateString();
        $dueSubscriptions = \App\Models\Subscription::where('is_active', true)
            ->where('next_payment_date', '<=', $today)
            ->get();

        $this->info("Processing {$dueSubscriptions->count()} subscriptions with passed payment dates.");

        foreach ($dueSubscriptions as $subscription) {
            // Log payment to history
            \App\Models\PaymentHistory::create([
                'subscription_id' => $subscription->id,
                'amount' => $subscription->amount,
                'payment_date' => $subscription->next_payment_date,
                'status' => 'completed',
            ]);

            // Calculate next payment date
            $nextDate = $this->calculateNextPaymentDate(
                $subscription->next_payment_date,
                $subscription->billing_cycle,
                $subscription->custom_cycle_days
            );

            // Update subscription
            $subscription->update([
                'next_payment_date' => $nextDate,
            ]);

            $this->info("Updated {$subscription->name}: next payment {$nextDate}");
        }

        $this->info('Payment processing complete!');
        return 0;
    }

    /**
     * Calculate the next payment date based on billing cycle
     */
    private function calculateNextPaymentDate($currentDate, $billingCycle, $customDays = null)
    {
        $date = \Carbon\Carbon::parse($currentDate);

        switch ($billingCycle) {
            case 'weekly':
                return $date->addWeek()->toDateString();
            case 'monthly':
                return $date->addMonth()->toDateString();
            case 'quarterly':
                return $date->addMonths(3)->toDateString();
            case 'biannual':
                return $date->addMonths(6)->toDateString();
            case 'yearly':
                return $date->addYear()->toDateString();
            case 'custom':
                if ($customDays) {
                    return $date->addDays($customDays)->toDateString();
                }
                // Fallback to monthly if custom days not set
                return $date->addMonth()->toDateString();
            default:
                return $date->addMonth()->toDateString();
        }
    }
}
