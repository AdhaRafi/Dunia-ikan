const CATEGORY_IMAGES = {
    'Penyakit Parasit': '/images/products/cupang-halfmoon.jpg',
    'Infeksi Bakteri / Jamur': '/images/products/cupang-plakat.jpg',
    'Gangguan Pencernaan & Organ': '/images/products/mas-koki-oranda.jpg',
    'Kualitas Air & Filter': '/images/banners/air-tawar.jpg',
    'Air Laut & Salinitas': '/images/products/clownfish-ocellaris.jpg',
    'Air Payau & Estuari': '/images/products/ikan-kiper.jpg',
    'Ikan Predator & Tank Besar': '/images/products/arwana-super-red.jpg',
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
            'bg-cyan-50 text-[#1E80A0] border-cyan-200/80 dark:bg-cyan-500/15 dark:text-[#4AB8BD] dark:border-cyan-500/30',
        dotClass: 'bg-[#1E80A0] dark:bg-[#4AB8BD]',
        shortLabel: 'Organ & Pencernaan',
    },
    'Kualitas Air & Filter': {
        badgeClass:
            'bg-sky-50 text-[#0684E5] border-sky-200/80 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
        dotClass: 'bg-[#0684E5]',
        shortLabel: 'Kualitas Air',
    },
    'Air Laut & Salinitas': {
        badgeClass:
            'bg-sky-50 text-[#0D2E92] border-sky-200/80 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
        dotClass: 'bg-[#0D2E92] dark:bg-sky-400',
        shortLabel: 'Air Laut',
    },
    'Air Payau & Estuari': {
        badgeClass:
            'bg-teal-50 text-teal-800 border-teal-200/80 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30',
        dotClass: 'bg-[#4AB8BD]',
        shortLabel: 'Air Payau',
    },
    'Ikan Predator & Tank Besar': {
        badgeClass:
            'bg-orange-50 text-orange-800 border-orange-200/80 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30',
        dotClass: 'bg-orange-500',
        shortLabel: 'Predator',
    },
};

export function getGuideImage(guide) {
    if (!guide) {
        return '/images/banners/air-tawar.jpg';
    }

    if (CATEGORY_IMAGES[guide.category]) {
        return CATEGORY_IMAGES[guide.category];
    }

    const fishType = (guide.fish_type || '').toLowerCase();
    if (fishType.includes('arwana') || fishType.includes('predator')) {
        return '/images/products/arwana-super-red.jpg';
    }
    if (fishType.includes('clownfish') || fishType.includes('tang') || fishType.includes('laut')) {
        return '/images/products/clownfish-ocellaris.jpg';
    }
    if (fishType.includes('payau') || fishType.includes('kiper') || fishType.includes('sumpit')) {
        return '/images/products/ikan-kiper.jpg';
    }
    if (fishType.includes('koki') || fishType.includes('oranda')) {
        return '/images/products/mas-koki-oranda.jpg';
    }
    if (fishType.includes('discus')) {
        return '/images/products/discus-pigeon-blood.jpg';
    }
    if (fishType.includes('guppy')) {
        return '/images/products/guppy-albino-full-red.jpg';
    }
    if (fishType.includes('channa')) {
        return '/images/products/channa-auranti.jpg';
    }
    if (fishType.includes('cupang') || fishType.includes('betta')) {
        return '/images/products/cupang-halfmoon.jpg';
    }

    return '/images/banners/air-tawar.jpg';
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
