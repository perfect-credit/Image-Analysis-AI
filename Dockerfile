FROM php:8.3-cli

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libcurl4-openssl-dev \
    curl \
    && docker-php-ext-install zip mbstring pdo pdo_mysql gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN chown -R www-data:www-data . \
    && chmod -R 755 . \
    && chmod -R 775 storage bootstrap/cache

USER www-data

RUN composer install --no-dev --optimize-autoloader

EXPOSE 8001

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8001"]