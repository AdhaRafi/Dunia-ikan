<?php

return [
    'except' => [
        'admin.*',
        'filament.*',
        'sanctum.*',
        'livewire.*',
        'default-livewire.*',
        'midtrans.notification',
        'storage.local',
        'storage.local.upload',
        'boost.*',
    ],

    'groups' => [
        'public' => [
            'home',
            'products.*',
            'stores.*',
            'guides.*',
            'chatbot.*',
            'cart.*',
            'checkout.*',
            'orders.*',
            'addresses.*',
            'profile.*',
            'seller.*',
            'dashboard',
            'login',
            'register',
            'password.*',
            'verification.*',
            'logout',
        ],
        'admin' => [
            'admin.*',
        ],
    ],
];
