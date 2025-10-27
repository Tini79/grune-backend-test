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
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');
        $companyId = $this->route('id');

        return [
            'name'            => ['required', 'string', 'max:50'],
            'email'           => array_merge(
                [
                    'required',
                    'string',
                    'lowercase',
                    'email',
                    'max:255',
                ],
                $isUpdate ?
                    [Rule::unique('companies', 'email')->ignore($companyId)] :
                    [Rule::unique('companies', 'email')]
            ),
            'postcode'        => ['required', 'string', 'size:7'],
            'prefecture_id'   => ['required', 'integer'],
            'city'            => ['required', 'string', 'max:255'],
            'local'           => ['required', 'string', 'max:255'],
            'street_address'  => ['nullable', 'string', 'max:255'],
            'business_hour'   => ['nullable', 'string', 'max:255'],
            'regular_holiday' => ['nullable', 'string', 'max:255'],
            'phone'           => ['integer'],
            // on db the length of 'fax' is 15 long, so I put size:50 instead
            'fax'             => ['nullable', 'string', 'max:15'],
            'url'             => ['nullable', 'string', 'max:255'],
            'license_number'  => ['nullable', 'string', 'max:50'],
            'image'           => [$isUpdate ? 'nullable' : 'required', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
        ];
    }
}
