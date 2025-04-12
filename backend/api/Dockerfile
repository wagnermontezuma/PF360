FROM php:8.2-fpm

# Argumentos para configuração
ARG user=laravel
ARG uid=1000

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Limpar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensões PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Obter Composer mais recente
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Criar usuário do sistema
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Definir diretório de trabalho
WORKDIR /var/www

# Criar diretório temporário e instalar Laravel
RUN mkdir -p /tmp/laravel && \
    cd /tmp/laravel && \
    composer create-project --prefer-dist laravel/laravel . && \
    composer require tymon/jwt-auth && \
    chown -R $user:www-data /tmp/laravel && \
    cp -r /tmp/laravel/. /var/www/ && \
    rm -rf /tmp/laravel

# Ajustar permissões
RUN chown -R $user:www-data /var/www && \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache && \
    chmod -R 775 /var/www

# Mudar para usuário não-root
USER $user

# Expor porta 9000 e iniciar php-fpm
EXPOSE 9000
CMD ["php-fpm"] 