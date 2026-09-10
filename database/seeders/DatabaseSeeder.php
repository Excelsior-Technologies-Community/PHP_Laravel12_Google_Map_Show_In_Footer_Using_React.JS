<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(['email' => 'test@example.com'], [
            'name' => 'Test User',
            'password' => 'password',
        ]);

        foreach ([
            [
                'name' => 'Ahmedabad Office',
                'address' => 'Ahmedabad, Gujarat, India',
                'latitude' => 23.0225,
                'longitude' => 72.5714,
                'phone' => '+91 99999 99999',
                'is_active' => true,
                'created_at' => now(),
            ],
            [
                'name' => 'Gandhinagar Office',
                'address' => 'Gandhinagar, Gujarat, India',
                'latitude' => 23.2156,
                'longitude' => 72.6369,
                'phone' => '+91 88888 88888',
                'is_active' => true,
                'created_at' => now(),
            ],
        ] as $location) {
            Location::updateOrCreate(['name' => $location['name']], $location);
        }
    }
}
