# 8.5 Estate Properties — Luxury Real Estate Website

A complete, production-style real estate platform for a Ghana-based luxury
agency: a cinematic public website plus a secure PHP/MySQL admin dashboard
with full property CRUD, multi-image uploads, and a lead/inquiry CRM.

Built with **HTML5 · CSS3 · vanilla JS (ES6) · PHP · MySQL**, enhanced with
GSAP, AOS, Swiper and Lightbox. No build step — drop it into `htdocs` and go.

---

## 1. Quick start (XAMPP)

1. **Copy the folder** into your XAMPP web root and rename it `85estate`:
   ```
   C:\xampp\htdocs\85estate        (Windows)
   /Applications/XAMPP/htdocs/85estate   (macOS)
   ```
2. **Start Apache and MySQL** from the XAMPP control panel.
3. **Create the database.** Open <http://localhost/phpmyadmin> → *Import* →
   choose `database/schema.sql` → *Go*. This creates the `estate85` database,
   all tables, and seed data (12 demo properties, agents, testimonials).
   *(CLI alternative: `mysql -u root -p < database/schema.sql`)*
4. **Configure.** The project ships with `php/config.php` already set to
   XAMPP defaults (host `127.0.0.1`, user `root`, empty password). If your
   MySQL has a password, edit `php/config.php` accordingly.
5. **Open the site:** <http://localhost/85estate/index.html>
6. **Open the admin dashboard:** <http://localhost/85estate/admin/login.php>
   - **Email:** `admin@85estate.com`
   - **Password:** `admin123`
   - **Change this immediately** (see *Security* below).

That's it — the site is fully browsable and every form writes to the database.

---

## 2. What's included

```
85estate/
├── index.html            Home (hero, featured, stats, testimonials, CTA)
├── sale.html             For-sale listings (filters, sort, grid/list)
├── rent.html             For-rent listings
├── property.html         Single property (gallery, map, mortgage calc, enquiry)
├── about.html            Story, mission, values, timeline, team
├── contact.html          Contact form + office map + FAQ
├── css/style.css         Full luxury design system
├── js/
│   ├── properties.js     Demo dataset + card render helpers
│   ├── main.js           Nav, GSAP, counters, swipers, wishlist, FAB, toast
│   ├── listing.js        Listing page filtering/sorting controller
│   └── detail.js         Property detail + mortgage calc + AJAX enquiry
├── php/
│   ├── config.php        Your live config (git-ignored)
│   ├── config.example.php Template to copy
│   ├── db.php            PDO connection
│   ├── helpers.php       Validation, sanitisation, spam/honeypot, rate limit
│   ├── mailer.php        PHPMailer/SMTP wrapper with mail() fallback
│   ├── contact.php       Contact form handler  (saves + emails + auto-reply)
│   ├── inquiry.php       Property enquiry handler (CRM + agent notify)
│   └── properties_api.php JSON API: serve DB properties to the front end
├── admin/
│   ├── login.php logout.php auth.php
│   ├── index.php         Dashboard with live stats
│   ├── properties.php    List + delete
│   ├── property_edit.php Add/edit + multi-image upload
│   ├── inquiries.php     Lead CRM (status: new→contacted→viewing→closed)
│   ├── messages.php      Contact inbox (read/unread/delete)
│   ├── testimonials.php agents.php blog.php
│   ├── includes/         Shared header/sidebar/footer
│   └── assets/admin.css
├── images/uploads/       Uploaded property images land here
├── videos/               Drop hero.mp4 here for the optional video hero
├── database/schema.sql   Full schema + seed data
├── sitemap.xml robots.txt
└── README.md
```

---

## 3. Email setup (optional but recommended)

Out of the box, plain XAMPP cannot send real email, so submissions are **still
saved to the database** and appear in the admin dashboard — no lead is ever
lost. To actually deliver emails (notifications + customer auto-responses):

1. **Install PHPMailer** (either method):
   - Composer: from the project root run `composer require phpmailer/phpmailer`
   - Manual: download PHPMailer and place its `src/` folder at
     `php/PHPMailer/src/` (so `php/PHPMailer/src/PHPMailer.php` exists).
2. **Enable SMTP** in `php/config.php` → `mail.smtp`:
   ```php
   'smtp' => [
     'enabled'  => true,
     'host'     => 'smtp.gmail.com',
     'port'     => 587,
     'secure'   => 'tls',
     'username' => 'you@gmail.com',
     'password' => 'your-app-password',   // Gmail → App Passwords
   ],
   ```
3. Set `mail.company_inbox` to where you want leads delivered.

> Gmail requires an **App Password** (with 2FA enabled), not your normal
> password. Any SMTP provider (Mailgun, SendGrid, Zoho, your host) works too.

---

## 4. Security — do this before going live

- **Change the admin password.** Log in, or run this and replace the hash in
  `admin_users`:
  ```bash
  php -r "echo password_hash('YourNewStrongPassword', PASSWORD_DEFAULT);"
  ```
  ```sql
  UPDATE admin_users SET password_hash='<paste hash>' WHERE email='admin@85estate.com';
  ```
- **Set a MySQL password** and update `php/config.php`.
- `php/config.php` is git-ignored and protected by `php/.htaccess`.
- Uploaded files are validated by extension + size, given random names, and
  `images/uploads/.htaccess` disables script execution there.
- All database access uses **PDO prepared statements**; admin forms use **CSRF
  tokens**; passwords use `password_hash`/`password_verify` (bcrypt).

---

## 5. Google Maps

Property and contact maps use Google's free **no-API-key embed**
(`?output=embed`), so they work immediately. For advanced features (custom
markers, styled maps, geocoding), get a **Maps JavaScript API key** from the
Google Cloud Console and swap the iframe for the JS API — the map containers
in `property.html` and `contact.html` are ready for it.

---

## 6. Images & video

- **Demo images** are loaded from Unsplash's CDN so the site looks complete out
  of the box. For production, upload real photos via the admin dashboard
  (**Properties → Add/Edit → Upload images**); they save to `images/uploads/`
  and override the demo URLs.
- **Video hero (optional):** drop a luxury aerial clip at `videos/hero.mp4`.
  The home hero is built to layer video over the image — see the hero `<section>`
  in `index.html`.

---

## 7. Going live with the database (front end → MySQL)

The public pages ship with a JS demo dataset (`js/properties.js`) so the site is
fully browsable with zero backend. When you're ready to drive listings from the
database instead, `php/properties_api.php` already returns the **same data
shape** as the JS file:

```
GET php/properties_api.php?status=sale&limit=12   → list
GET php/properties_api.php?id=5                    → single property
```

Fetch from these endpoints in `listing.js` / `detail.js` (replace the
`PROPERTIES` reference with an API call) and the whole front end runs on live,
admin-managed data. Until then, both stay in sync because the seed data in
`schema.sql` mirrors `properties.js`.

---

## 8. Form endpoints (contract)

Both public forms submit via AJAX and expect JSON `{ ok, message }`:

| Form | Endpoint | Saves to | Notifies |
|------|----------|----------|----------|
| Contact (`contact.html`) | `php/contact.php` | `messages` | company inbox + customer auto-reply |
| Property enquiry (`property.html`) | `php/inquiry.php` | `inquiries` (with `property_id`) | company inbox + assigned agent + customer auto-reply |

Both include a hidden **honeypot** field (`website`) and a simple per-IP rate
limit for spam protection.

---

## 9. Notes on the build

- Contact number used throughout: **+233 54 585 4423**
  (WhatsApp link `https://wa.me/233545854423`). Update in the page footers,
  the floating contact widget, and `php/config.php` if it changes.
- Default brand email: `hello@85estate.com`.
- Tested on PHP 8.3 + MariaDB 10.11; works on PHP 7.4+ / MySQL 5.7+.

---

*Designed and built as a complete, deployable package. Replace the demo
content with the agency's real listings and credentials, and it's ready to
ship.*
