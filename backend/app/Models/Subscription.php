<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'amount',
        'currency',
        'billing_cycle',
        'custom_cycle_days',
        'start_date',
        'next_payment_date',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'next_payment_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function paymentHistory()
    {
        return $this->hasMany(PaymentHistory::class);
    }
}
