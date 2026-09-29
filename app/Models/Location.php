<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'phone',
        'is_active',
        'is_featured',
        'map_views',
        'direction_requests',
        'last_viewed_at',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'map_views' => 'integer',
        'direction_requests' => 'integer',
        'last_viewed_at' => 'datetime',
    ];
}