<?php

namespace App\Support;

use Illuminate\Validation\Rule;

class ContactValidation
{
    public const EMAIL_REGEX = '/^[^\s@]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/';

    public const PHONE_REGEX = '/^(?:(?:\+?62|0)8[1-9][0-9]{7,11}|(?:\+?62|0)[2-79][0-9]{7,10}|\+(?!62)[1-9][0-9]{8,14})$/';

    public static function normalizeEmail(?string $value): string
    {
        return strtolower(trim((string) $value));
    }

    public static function normalizePhone(?string $value): string
    {
        $cleaned = preg_replace('/[\s.\-()]+/', '', trim((string) $value));

        return (string) ($cleaned ?? '');
    }

    /**
     * Strict email validation requiring a real domain with a TLD (e.g. nama@gmail.com).
     *
     * @return list<mixed>
     */
    public static function emailRules(?int $ignoreUserId = null): array
    {
        $unique = $ignoreUserId !== null
            ? Rule::unique('users', 'email')->ignore($ignoreUserId)
            : Rule::unique('users', 'email');

        return [
            'required',
            'string',
            'lowercase',
            'email:rfc,strict',
            'regex:'.self::EMAIL_REGEX,
            'max:255',
            $unique,
        ];
    }

    /**
     * Strict Indonesian/international phone number validation.
     *
     * @return list<string>
     */
    public static function phoneRules(bool $sometimes = false): array
    {
        $rules = [
            'required',
            'string',
            'min:10',
            'max:16',
            'regex:'.self::PHONE_REGEX,
        ];

        if ($sometimes) {
            array_unshift($rules, 'sometimes');
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    public static function messages(): array
    {
        return [
            'email.email' => 'Format email tidak valid. Gunakan domain lengkap seperti nama@gmail.com.',
            'email.regex' => 'Format email tidak valid. Gunakan domain lengkap seperti nama@gmail.com.',
            'phone.required' => 'Nomor HP / WhatsApp wajib diisi.',
            'phone.min' => 'Nomor HP / WhatsApp minimal 10 digit.',
            'phone.max' => 'Nomor HP / WhatsApp maksimal 16 karakter.',
            'phone.regex' => 'Nomor HP / WhatsApp tidak valid. Gunakan format seperti 081234567890 atau +6281234567890.',
        ];
    }
}
