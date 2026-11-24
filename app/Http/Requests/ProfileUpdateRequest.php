<?php

namespace App\Http\Requests;

use App\Support\ContactValidation;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('email')) {
            $this->merge([
                'email' => ContactValidation::normalizeEmail($this->input('email')),
            ]);
        }

        if ($this->has('phone')) {
            $this->merge([
                'phone' => ContactValidation::normalizePhone($this->input('phone')),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ContactValidation::emailRules($this->user()->id),
            'phone' => ContactValidation::phoneRules(sometimes: true),
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'remove_avatar' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return ContactValidation::messages();
    }
}
