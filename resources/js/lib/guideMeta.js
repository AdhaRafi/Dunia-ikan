const CATEGORY_IMAGES = {
    'Penyakit Parasit': '/images/products/cupang-halfmoon.jpg',
    'Infeksi Bakteri / Jamur': '/images/products/cupang-plakat.jpg',
    'Gangguan Pencernaan & Organ': '/images/products/discus-pigeon-blood.jpg',
    'Kualitas Air & Filter': '/images/products/aquarium-rimless.jpg',
};

const CATEGORY_META = {
    'Penyakit Parasit': {
        badgeClass:
            'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
        dotClass: 'bg-amber-500',
        shortLabel: 'Parasit',
    },
    'Infeksi Bakteri / Jamur': {
        badgeClass:
            'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
        dotClass: 'bg-rose-500',
        shortLabel: 'Bakteri & Jamur',
    },
    'Gangguan Pencernaan & Organ': {
        badgeClass:
            'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30',
        dotClass: 'bg-indigo-500',
        shortLabel: 'Organ & Pencernaan',
    },
    'Kualitas Air & Filter': {
        badgeClass:
            'bg-sky-50 text-[#0684E5] border-sky-200/80 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
        dotClass: 'bg-[#0684E5]',
        shortLabel: 'Kualitas Air',
    },
};

export function getGuideImage(guide) {
    if (!guide) {
        return '/images/products/aquarium-rimless.jpg';
    }

    if (CATEGORY_IMAGES[guide.category]) {
        return CATEGORY_IMAGES[guide.category];
    }

    const fishType = (guide.fish_type || '').toLowerCase();
    if (fishType.includes('guppy')) {
        return '/images/products/guppy-albino-full-red.jpg';
    }
    if (fishType.includes('channa')) {
        return '/images/products/channa-maru.jpg';
    }
    if (fishType.includes('cupang') || fishType.includes('betta')) {
        return '/images/products/cupang-halfmoon.jpg';
    }

    return '/images/products/aquarium-rimless.jpg';
}

export function getCategoryBadgeMeta(category) {
    return (
        CATEGORY_META[category] || {
            badgeClass:
                'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
            dotClass: 'bg-slate-500',
            shortLabel: category || 'Panduan',
        }
    );
}

export function estimateReadingMinutes(guide) {
    if (!guide) {
        return 1;
    }

    const text = [
        guide.title,
        guide.symptoms,
        guide.possible_causes,
        guide.care_instructions,
        guide.prevention,
    ]
        .filter(Boolean)
        .join(' ')
        .trim();

    if (!text) {
        return 1;
    }

    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 160));
}

export function parseCareSteps(rawText) {
    if (!rawText) {
        return [];
    }

    const lines = rawText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    const hasNumberedSteps = lines.some((line) => /^\d+[\.)]\s+/.test(line));
    if (!hasNumberedSteps) {
        return lines.map((line, index) => ({
            number: index + 1,
            text: line,
        }));
    }

    const steps = [];
    for (const line of lines) {
        const match = line.match(/^(\d+)[\.)]\s+(.*)$/);
        if (match) {
            steps.push({
                number: Number(match[1]),
                text: match[2].trim(),
            });
        } else if (steps.length > 0) {
            steps[steps.length - 1].text += ` ${line}`;
        } else {
            steps.push({ number: 1, text: line });
        }
    }

    return steps;
}
