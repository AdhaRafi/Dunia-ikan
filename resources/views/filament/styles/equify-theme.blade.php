<style>
    /* Dunia Ikan Logo Switching (dark ink on light auth screen, pure white inside Equify dark header/drawer) */
    .equify-brand-logo-wrap {
        display: inline-flex;
        align-items: center;
        height: 100%;
        user-select: none;
    }

    .equify-logo-img {
        height: 100%;
        width: auto;
        max-width: 100%;
        object-fit: contain;
    }

    .equify-logo-dark {
        display: block;
    }

    .equify-logo-light {
        display: none;
    }

    html.dark .equify-logo-dark,
    .fi-body.fi-body-has-navigation .fi-topbar .equify-logo-dark,
    .fi-body.fi-body-has-navigation .fi-sidebar-header .equify-logo-dark {
        display: none !important;
    }

    html.dark .equify-logo-light,
    .fi-body.fi-body-has-navigation .fi-topbar .equify-logo-light,
    .fi-body.fi-body-has-navigation .fi-sidebar-header .equify-logo-light {
        display: block !important;
    }

    /* Chart filter select single-line fix (suppresses Chromium native double arrow & wrapping) */
    .fi-wi-chart .fi-section-header {
        align-items: center !important;
        gap: 0.75rem;
    }

    .fi-wi-chart .fi-wi-chart-filter {
        flex-shrink: 0 !important;
        min-width: 7.75rem !important;
    }

    .fi-wi-chart select.fi-select-input {
        -webkit-appearance: none !important;
        appearance: none !important;
        height: 2.25rem !important;
        min-width: 7.5rem !important;
        padding: 0.375rem 2rem 0.375rem 0.75rem !important;
        line-height: 1.4 !important;
        white-space: nowrap !important;
    }

    .fi-wi-chart select.fi-select-input::picker-icon {
        display: none !important;
    }

    /* Prevent large IDR KPI figures like "Rp 195.000" from wrapping across lines */
    .fi-wi-stats-overview-stat-value {
        font-size: clamp(1.3rem, 1.45vw, 1.7rem) !important;
        line-height: 1.2 !important;
        white-space: nowrap !important;
    }

    /* Equify Hybrid SaaS Shell: Obsidian Navigation + Clean Light Workspace Canvas */
    html:not(.dark) .fi-body.fi-body-has-navigation {
        background-color: #15171c !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-topbar {
        background-color: #15171c !important;
        box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.06) !important;
        --tw-ring-color: transparent !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-topbar-open-sidebar-btn,
    html:not(.dark) .fi-body.fi-body-has-navigation .fi-topbar-close-sidebar-btn,
    html:not(.dark) .fi-body.fi-body-has-navigation .fi-topbar-open-collapse-sidebar-btn,
    html:not(.dark) .fi-body.fi-body-has-navigation .fi-topbar-close-collapse-sidebar-btn,
    html:not(.dark) .fi-body.fi-body-has-navigation .fi-topbar-database-notifications-btn {
        color: #d1d5db !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-topbar-open-sidebar-btn:hover,
    html:not(.dark) .fi-body.fi-body-has-navigation .fi-topbar-open-collapse-sidebar-btn:hover,
    html:not(.dark) .fi-body.fi-body-has-navigation .fi-topbar-close-collapse-sidebar-btn:hover {
        color: #ffffff !important;
        background-color: rgba(255, 255, 255, 0.08) !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-sidebar {
        background-color: #15171c !important;
        border-inline-end: 1px solid rgba(255, 255, 255, 0.06);
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-sidebar-header {
        background-color: #15171c !important;
        --tw-ring-color: rgba(255, 255, 255, 0.08) !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-sidebar-group-label {
        color: #6b7280 !important;
        font-size: 0.7rem !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.08em !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-sidebar-group-btn .fi-icon {
        color: #6b7280 !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-sidebar-item-label {
        color: #d1d5db !important;
        font-weight: 500 !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-sidebar-item-btn > .fi-icon {
        color: #9ca3af !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-sidebar-item.fi-sidebar-item-has-url > .fi-sidebar-item-btn:hover {
        background-color: rgba(255, 255, 255, 0.07) !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-sidebar-item.fi-sidebar-item-has-url > .fi-sidebar-item-btn:hover .fi-sidebar-item-label,
    html:not(.dark) .fi-body.fi-body-has-navigation .fi-sidebar-item.fi-sidebar-item-has-url > .fi-sidebar-item-btn:hover > .fi-icon {
        color: #ffffff !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-sidebar-item.fi-active > .fi-sidebar-item-btn {
        background: linear-gradient(90deg, rgba(0, 192, 232, 0.18), rgba(0, 192, 232, 0.04)) !important;
        box-shadow: inset 3px 0 0 #00c0e8 !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-sidebar-item.fi-active > .fi-sidebar-item-btn > .fi-icon {
        color: #00c0e8 !important;
    }

    html:not(.dark) .fi-body.fi-body-has-navigation .fi-sidebar-item.fi-active > .fi-sidebar-item-btn > .fi-sidebar-item-label {
        color: #ffffff !important;
        font-weight: 600 !important;
    }

    /* Main Workspace Canvas */
    html:not(.dark) .fi-body.fi-body-has-navigation .fi-main-ctn {
        background-color: #f4f6f8 !important;
    }

    @media (min-width: 1024px) {
        html:not(.dark) .fi-body.fi-body-has-navigation .fi-main-ctn {
            border-top-left-radius: 1.5rem;
        }
    }

    /* Clean Equify 14px Surface Cards & Subtle Shadows */
    html:not(.dark) .fi-wi-stats-overview-stat,
    html:not(.dark) .fi-section,
    html:not(.dark) .fi-ta-ctn,
    html:not(.dark) .equify-report-kpi {
        border-radius: 14px !important;
        border: 1px solid rgba(15, 23, 42, 0.06) !important;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.02) !important;
    }

    html:not(.dark) .fi-wi-stats-overview-stat,
    html:not(.dark) .equify-report-kpi {
        transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.18s ease;
    }

    html:not(.dark) .fi-wi-stats-overview-stat:hover,
    html:not(.dark) .equify-report-kpi:hover {
        transform: translateY(-3px);
        border-color: rgba(14, 165, 233, 0.28) !important;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07) !important;
    }

    .fi-btn {
        transition: transform 0.16s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.16s ease, filter 0.16s ease !important;
    }

    .fi-btn:hover:not(:disabled) {
        transform: translateY(-1px);
    }

    .fi-btn:active:not(:disabled) {
        transform: scale(0.97);
    }

    @media (prefers-reduced-motion: reduce) {
        html:not(.dark) .fi-wi-stats-overview-stat,
        html:not(.dark) .equify-report-kpi,
        .fi-btn {
            transition: none !important;
            transform: none !important;
        }
    }

    /* Dark Mode Cohesive Tuning */
    html.dark .fi-body.fi-body-has-navigation {
        background-color: #0b0d11 !important;
    }

    html.dark .fi-body.fi-body-has-navigation .fi-topbar,
    html.dark .fi-body.fi-body-has-navigation .fi-sidebar {
        background-color: #111318 !important;
    }

    html.dark .fi-body.fi-body-has-navigation .fi-main-ctn {
        background-color: #161922 !important;
    }

    @media (min-width: 1024px) {
        html.dark .fi-body.fi-body-has-navigation .fi-main-ctn {
            border-top-left-radius: 1.5rem;
        }
    }

    /* City Distribution Widget (self-contained layout & colors) */
    .equify-city-wrap {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .equify-map-box {
        border-radius: 0.75rem;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background-color: #f8fafc;
        padding: 0.75rem;
    }

    html.dark .equify-map-box {
        border-color: rgba(255, 255, 255, 0.1);
        background-color: rgba(17, 24, 39, 0.55);
    }

    .equify-map-svg {
        display: block;
        height: 9rem;
        width: 100%;
    }

    .equify-city-bar {
        display: flex;
        height: 0.625rem;
        width: 100%;
        overflow: hidden;
        border-radius: 9999px;
        background-color: #e5e7eb;
    }

    html.dark .equify-city-bar {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .equify-city-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }

    @media (min-width: 640px) {
        .equify-city-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    .equify-city-chip {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 0.75rem;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background-color: #ffffff;
        padding: 0.5rem 0.75rem;
    }

    html.dark .equify-city-chip {
        border-color: rgba(255, 255, 255, 0.1);
        background-color: rgba(255, 255, 255, 0.04);
    }

    .equify-city-chip-left {
        display: flex;
        min-width: 0;
        align-items: center;
        gap: 0.5rem;
    }

    .equify-city-dot {
        height: 0.625rem;
        width: 0.625rem;
        flex-shrink: 0;
        border-radius: 9999px;
    }

    .equify-city-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.875rem;
        font-weight: 600;
        color: #1f2937;
    }

    html.dark .equify-city-name {
        color: #f3f4f6;
    }

    .equify-city-count {
        margin-left: 0.5rem;
        flex-shrink: 0;
        font-size: 0.75rem;
        font-weight: 500;
        color: #6b7280;
    }

    html.dark .equify-city-count {
        color: #9ca3af;
    }

    /* Transaction Reports Page Responsive Grids & Cards */
    .equify-report-stack {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .equify-print-header {
        display: none;
    }

    .equify-preset-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }

    .equify-preset-buttons {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
    }

    .equify-preset-label {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #6b7280;
    }

    html.dark .equify-preset-label {
        color: #9ca3af;
    }

    .equify-report-filters {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.875rem;
    }

    @media (min-width: 640px) {
        .equify-report-filters {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (min-width: 1024px) {
        .equify-report-filters {
            grid-template-columns: repeat(5, minmax(0, 1fr));
        }
    }

    .equify-filter-label {
        display: block;
        margin-bottom: 0.35rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: #4b5563;
    }

    html.dark .equify-filter-label {
        color: #d1d5db;
    }

    .equify-filter-input {
        width: 100%;
        border-radius: 0.5rem;
        border: 1px solid #d1d5db;
        background-color: #ffffff;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        color: #111827;
        outline: none;
    }

    .equify-filter-input:focus {
        border-color: #0ea5e9;
        box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.16);
    }

    html.dark .equify-filter-input {
        border-color: rgba(255, 255, 255, 0.15);
        background-color: #111827;
        color: #ffffff;
    }

    .equify-report-kpis {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    @media (min-width: 640px) {
        .equify-report-kpis {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (min-width: 1280px) {
        .equify-report-kpis {
            grid-template-columns: repeat(4, minmax(0, 1fr));
        }
    }

    .equify-report-kpi {
        background-color: #ffffff;
        padding: 1.25rem;
        border-radius: 14px;
        border: 1px solid rgba(15, 23, 42, 0.08);
    }

    html.dark .equify-report-kpi {
        background-color: #111827;
        border-color: rgba(255, 255, 255, 0.1);
    }

    .equify-kpi-label {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #6b7280;
    }

    html.dark .equify-kpi-label {
        color: #9ca3af;
    }

    .equify-kpi-value {
        margin-top: 0.5rem;
        font-size: clamp(1.3rem, 1.5vw, 1.65rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        color: #0f172a;
        white-space: nowrap;
    }

    html.dark .equify-kpi-value {
        color: #ffffff;
    }

    .equify-kpi-sub {
        margin-top: 0.375rem;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .equify-kpi-sub-emerald { color: #059669; }
    .equify-kpi-sub-sky { color: #0284c7; }
    .equify-kpi-sub-muted { color: #6b7280; }
    .equify-kpi-sub-rose { color: #e11d48; }

    html.dark .equify-kpi-sub-emerald { color: #34d399; }
    html.dark .equify-kpi-sub-sky { color: #38bdf8; }
    html.dark .equify-kpi-sub-muted { color: #9ca3af; }
    html.dark .equify-kpi-sub-rose { color: #fb7185; }

    .equify-report-alert {
        border-radius: 0.75rem;
        border: 1px solid #fde68a;
        background-color: #fffbeb;
        padding: 0.75rem 1rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: #92400e;
    }

    html.dark .equify-report-alert {
        border-color: rgba(245, 158, 11, 0.35);
        background-color: rgba(120, 53, 15, 0.3);
        color: #fcd34d;
    }

    .equify-table-scroll {
        overflow-x: auto;
    }

    .equify-report-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
        font-size: 0.875rem;
    }

    .equify-report-table thead tr {
        border-bottom: 1px solid rgba(15, 23, 42, 0.1);
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #6b7280;
    }

    html.dark .equify-report-table thead tr {
        border-color: rgba(255, 255, 255, 0.1);
        color: #9ca3af;
    }

    .equify-report-table th,
    .equify-report-table td {
        padding: 0.65rem 0.75rem;
        vertical-align: middle;
    }

    .equify-report-table tbody tr {
        border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    }

    html.dark .equify-report-table tbody tr {
        border-color: rgba(255, 255, 255, 0.06);
    }

    .equify-report-table tbody tr:hover {
        background-color: rgba(15, 23, 42, 0.025);
    }

    html.dark .equify-report-table tbody tr:hover {
        background-color: rgba(255, 255, 255, 0.03);
    }

    .equify-pay-pill {
        display: inline-flex;
        align-items: center;
        border-radius: 9999px;
        padding: 0.2rem 0.6rem;
        font-size: 0.72rem;
        font-weight: 600;
        white-space: nowrap;
    }

    .equify-pay-pill-verified {
        background-color: #ecfdf5;
        color: #047857;
    }

    .equify-pay-pill-neutral {
        background-color: #f3f4f6;
        color: #374151;
    }

    html.dark .equify-pay-pill-verified {
        background-color: rgba(16, 185, 129, 0.16);
        color: #6ee7b7;
    }

    html.dark .equify-pay-pill-neutral {
        background-color: rgba(255, 255, 255, 0.1);
        color: #d1d5db;
    }

    /* Print / Save to PDF Clean Layout */
    @media print {
        .fi-topbar-ctn,
        .fi-sidebar,
        .fi-sidebar-close-overlay,
        .fi-header-actions,
        .equify-print-hide {
            display: none !important;
        }

        .equify-print-header {
            display: flex !important;
            align-items: flex-start;
            justify-content: space-between;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 1rem;
        }

        html,
        body,
        .fi-body,
        .fi-layout,
        .fi-main-ctn,
        .fi-main {
            background: #ffffff !important;
            color: #111827 !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
        }

        .fi-section,
        .equify-report-kpi {
            box-shadow: none !important;
            border: 1px solid #d1d5db !important;
            break-inside: avoid;
        }
    }
</style>
