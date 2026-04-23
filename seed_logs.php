<?php
use App\Models\User;
use App\Models\Order;
use App\Models\ActivityLog;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$users = User::all();
foreach($users as $u) {
    ActivityLog::create([
        'username' => $u->name,
        'action' => 'Account Registration',
        'category' => 'User',
        'status' => 'success',
        'metadata' => [
            'email' => $u->email,
            'details' => 'New user account created successfully'
        ]
    ]);
}

$orders = Order::all();
foreach($orders as $o) {
    ActivityLog::create([
        'username' => 'System',
        'action' => 'Order Placement',
        'category' => 'Sales',
        'status' => 'success',
        'metadata' => [
            'details' => 'Order #' . $o->id . ' received for P' . $o->total_amount,
            'email' => 'admin@kokommerce.com'
        ]
    ]);
}

echo "Created " . ActivityLog::count() . " logs.\n";
