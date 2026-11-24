const STRICT_EMAIL_REGEX =
    /^[^\s@]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

const PHONE_REGEX =
    /^(?:(?:\+?62|0)8[1-9][0-9]{7,11}|(?:\+?62|0)[2-79][0-9]{7,10}|\+(?!62)[1-9][0-9]{8,14})$/;

const COMMON_EMAIL_DOMAIN_TYPOS = {
    'gmal.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gmail.con': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gmail.cm': 'gmail.com',
    'yaho.com': 'yahoo.com',
    'yahoo.con': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
};

export function normalizePhoneInput(value) {
    return String(value ?? '').replace(/[\s.\-()]+/g, '').trim();
}

export function getEmailValidationError(email, serverError, pick) {
    const trimmed = String(email ?? '').trim().toLowerCase();

    if (trimmed) {
        if (!STRICT_EMAIL_REGEX.test(trimmed)) {
            return pick(
                'Format email tidak valid. Gunakan domain lengkap seperti nama@gmail.com.',
                'Invalid email format. Use a full domain like name@gmail.com.',
            );
        }

        const domain = trimmed.split('@')[1] || '';
        const suggested = COMMON_EMAIL_DOMAIN_TYPOS[domain];
        if (suggested) {
            return pick(
                `Domain email terlihat typo. Maksud Anda @${suggested}?`,
                `That email domain looks like a typo. Did you mean @${suggested}?`,
            );
        }
    }

    return serverError;
}

export function getPhoneValidationError(phone, serverError, pick) {
    const normalized = normalizePhoneInput(phone);

    if (normalized && !PHONE_REGEX.test(normalized)) {
        return pick(
            'Nomor HP / WhatsApp tidak valid. Contoh: 081234567890 atau +6281234567890.',
            'Invalid phone / WhatsApp number. Example: 081234567890 or +6281234567890.',
        );
    }

    return serverError;
}
