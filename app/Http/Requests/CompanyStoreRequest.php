<?php
namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'            => ['required', 'string', 'max:50'],
            'email'           => ['required', 'string', 'lowercase', 'email', 'max:255'],
            'postcode'        => ['required', 'string', 'size:7'],
            'prefecture_id'   => ['required', 'integer'],
            'city'            => ['required', 'string', 'max:255'],
            'local'           => ['required', 'string', 'max:255'],
            'street_address'  => ['string', 'max:255'],
            'business_hour'   => ['string', 'max:255'],
            'regular_holiday' => ['string', 'max:255'],
            'phone'           => ['integer'],
            // on db the length of 'fax' is 15 long, so I put size:50 instead
            'fax'             => ['required', 'string', 'max:15'],
            'url'             => ['required', 'string', 'max:255'],
            'license_number'  => ['required', 'string', 'max:50'],
            'image'           => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
        ];
    }
}