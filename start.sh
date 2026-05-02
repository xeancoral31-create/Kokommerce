#!/bin/sh

# Optimization
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Database and Storage
php artisan migrate --force
php artisan storage:link --force

# Start the web server (Nginx + PHP-FPM is the Nixpacks default)
# If using Nixpacks, it handles the web server start automatically if we don't block it.
# However, to be explicit and avoid 'php artisan serve', we use this:
if [ -f /etc/apache2/apache2.conf ]; then
    apache2-foreground
else
    # Default to a generic start or let the platform handle it
    # For Nixpacks, we usually don't need a start command if we use setup/install/build phases
    echo "Starting Production Server..."
    # If this is being run via Dockerfile or Procfile, we need to know the runner.
    # In this project's current Dockerfile, it uses CLI. We should change that.
fi
