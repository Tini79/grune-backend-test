<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'prefecture_id',
        'phone',
        'postcode',
        'city',
        'local',
        'street_address',
        'business_hour',
        'regular_holiday',
        'image',
        'fax',
        'url',
        'license_number',
    ];
}
