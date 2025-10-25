<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\UploadedFile;
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
     * Get the prefecture that owns the company.
     */
    public function prefecture(): BelongsTo
    {
        return $this->belongsTo(Prefecture::class);
    }

    /**
     * Handle image upload and save hashed filename to storage.
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @return string  The stored file path
     */
    public static function uploadImage(UploadedFile $file): string
    {
        $filename = time() . '_' . $file->getClientOriginalName();
        $hashed   = hash('sha256', $filename) . '.' . $file->getClientOriginalExtension();
        $path     = $file->storeAs('images/companies', $hashed);

        return $path;
    }

    /**
     * Delete a company by its ID.
     *
     * This method removes a specific company record from the `companys` table
     * based on the given ID using Laravel's Query Builder.
     *
     * @param int $id  The unique identifier of the user to delete.
     * @return int     The number of deleted records (0 or 1).
     */
    public static function deleteCompanyById(int $id)
    {
        return DB::table('companies')->where('id', $id)->delete();
    }
}