<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    /**
     * Delete a company by its ID.
     *
     * This method removes a specific company record from the `companys` table
     * based on the given ID using Laravel's Query Builder.
     */
    public function deleteCompanyById(int $id)
    {
        return DB::table('companies')->where('id', $id)->delete();
    }
}
