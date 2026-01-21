<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name', 200);
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD'); // ISO 4217 currency codes
            $table->enum('billing_cycle', ['weekly', 'monthly', 'quarterly', 'biannual', 'yearly', 'custom'])->default('monthly');
            $table->integer('custom_cycle_days')->nullable(); // For custom billing cycles
            $table->date('start_date');
            $table->date('next_payment_date');
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('next_payment_date');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
