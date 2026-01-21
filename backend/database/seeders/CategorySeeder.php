<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Entertainment', 'icon' => '🎬', 'color' => '#ef4444'],
            ['name' => 'Software', 'icon' => '💻', 'color' => '#3b82f6'],
            ['name' => 'Utilities', 'icon' => '⚡', 'color' => '#f59e0b'],
            ['name' => 'Health & Fitness', 'icon' => '💪', 'color' => '#10b981'],
            ['name' => 'Education', 'icon' => '📚', 'color' => '#8b5cf6'],
            ['name' => 'News & Media', 'icon' => '📰', 'color' => '#6366f1'],
            ['name' => 'Music', 'icon' => '🎵', 'color' => '#ec4899'],
            ['name' => 'Gaming', 'icon' => '🎮', 'color' => '#06b6d4'],
            ['name' => 'Cloud Storage', 'icon' => '☁️', 'color' => '#14b8a6'],
            ['name' => 'Other', 'icon' => '📦', 'color' => '#64748b'],
        ];

        foreach ($categories as $category) {
            \DB::table('categories')->insert([
                'name' => $category['name'],
                'icon' => $category['icon'],
                'color' => $category['color'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
