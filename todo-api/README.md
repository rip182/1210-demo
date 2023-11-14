# Setting Up Laravel Locally

## Prerequisites

Make sure you have the following installed on your local machine:

- [PHP](https://www.php.net/) (>= 7.4)
- [Composer](https://getcomposer.org/)

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/your-laravel-project.git
cd your-laravel-project


composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
