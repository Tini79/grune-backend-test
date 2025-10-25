<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prefecture extends Model
{
    use HasFactory;

    /**
     * Get the companies for the prefecture.
     */
    public function company(): HasMany
    {
        return $this->hasMany(Company::class);
    }
}
