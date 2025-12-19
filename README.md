# PHP_Laravel12_Google_Map_Show_In_Footer_Using_React.JS

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react">
  <img src="https://img.shields.io/badge/Inertia.js-SPA-blueviolet?style=for-the-badge">
  <img src="https://img.shields.io/badge/Google%20Maps-Footer-success?style=for-the-badge">
</p>

---

##  Overview

✔ Company information  
✔ Legal links  
✔ Social media icons  
✔ **Embedded Google Map location**  



---

##  Features

- Laravel 12 latest structure
- Breeze authentication
- React.js with Inertia SPA
- Tailwind CSS styling
- Google Map embedded in footer
- Reusable Footer component
- Clean layout architecture
- Easy location customization

---

##  Folder Structure

```
resources/
├── js/
│   ├── Layouts/
│   │   └── AppLayout.jsx
|   |   └── Footer.jsx
routes/
└── web.php
.env
README.md
```

---

##  Step 1 — Install Laravel 12

```bash
composer create-project laravel/laravel google-map-footer
```

Run server:

```bash
php artisan serve
```

---

##  Step 2 — Environment Configuration (.env)

```env

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

---

##  Step 3 — Install Breeze with Inertia + React

```bash
composer require laravel/breeze --dev

php artisan breeze:install react

npm install

php artisan migrate

npm run dev
```

---

##  Step 4 — Install react-icons

```bash
npm install react-icons
```

---

---

##  Step 5 — Footer Component with Google Map

📄 **resources/js/Layouts/Footer.jsx**

```jsx
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div>
          <h3 className="text-white text-lg font-semibold mb-3">MyCompany</h3>
          <p className="text-sm">
            We build secure and scalable Laravel + React applications.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Refund Policy</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4 text-xl">
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
          </div>
        </div>


     // Google Map Code
        <div>
          <h4 className="text-white font-semibold mb-3">Our Location</h4>
          <iframe
            src="https://www.google.com/maps?q=Ahmedabad&output=embed"
            className="w-full h-32 rounded"
            loading="lazy"
          ></iframe>
        </div>

      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} MyCompany. All rights reserved.
      </div>
    </footer>
  )
}
```

---

##  Step 6 — Layout File

📄 **resources/js/Layouts/AppLayout.jsx**

```jsx
import Footer from './Footer'

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-6 py-8">
                {children}
            </main>

            <Footer />
        </div>
    )
}

```

---

##  Step 7 — Routes

📄 **routes/web.php**

```php
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

```

---

##  Step 8 — Run Application

```bash
php artisan serve

npm run dev
```

Open in browser:

```
http://127.0.0.1:8000
```
GOOGLE MAP:-

<img width="1907" height="929" alt="Screenshot 2025-12-18 173722" src="https://github.com/user-attachments/assets/a29e227c-f2d2-4faf-ac5e-7c30fe2a6862" />

---

##  Change Google Map Location

Change only this line:

```
src="https://www.google.com/maps?q=Ahmedabad&output=embed"

```

With:

```
q=Surat
q=Mumbai
q=Delhi
q=Your+Office+Address

```

---

