FROM php:7.2-cli

RUN apt-get update \
&& apt-get install -y pkg-config curl libpng-dev libcurl3 libcurl3-dev libicu-dev libxml2-dev \
&& rm -rf /var/lib/apt/lists/*


RUN docker-php-ext-install gd json mbstring intl xml zip pdo_mysql

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php && \
    php -r "unlink('composer-setup.php');" && \
    mv composer.phar /usr/local/bin/composer

COPY app /var/www/app

WORKDIR /var/www/app/

RUN composer require "usmanhalalit/laracsv:1.*@dev" && composer install
EXPOSE 8000

CMD php -S 0.0.0.0:8000 -t public
