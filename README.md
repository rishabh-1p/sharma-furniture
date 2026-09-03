# Sharma Furniture — website

A self-contained, multi-page static website for Sharma Furniture (Bijnor
Road, near Kaveri Dental Care, Bijnor, Lucknow). No build step and no
server required.

## Structure

```
index.html              Home
products.html            Products — all six categories in detail
services.html            Repair & custom orders (with a "how it works" section)
gallery.html             Photo gallery
about.html                Our story, facts, why-us
contact.html              Hours, address, map link, full FAQ

assets/css/style.css     All styling — palette + type + layout live in the
                          :root custom properties at the top of the file
assets/js/main.js        Small progressive-enhancement script (auto-updates
                          the "years in business" figure and footer year,
                          plus the mobile nav toggle) — every page works
                          fine with JavaScript disabled
assets/img/               Photography shared across all six pages
```

Every page shares the same header, top bar, footer and floating
call/WhatsApp buttons, and all point at the same `assets/` folder — so
there's nothing to duplicate when you update a photo, a color, or the
phone number.

## Viewing it

Just open `index.html` in a browser and click through the nav, or serve
the folder with any static file server, e.g.:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Publishing it

Upload the whole folder as-is to any static host (Netlify, Vercel, GitHub
Pages, cPanel/shared hosting, etc.) — there's nothing to build or install.
Keep the folder structure intact (in particular, keep `assets/` alongside
the `.html` files) so the relative links between pages keep working.

## Editing the business details

Phone/WhatsApp number, address, hours, rating and payment methods appear
as plain text, repeated on each page (top bar, header, footer, and the
relevant content section) — search every `.html` file for `94123 42707`
or `Bijnor Road` to find every spot that needs updating if any of this
changes. The "years in business" stat and footer copyright year update
themselves automatically each year (see `assets/js/main.js`,
`established = 2021`).

## Adding or renaming pages

Copy the closest existing page as a starting point, keep the `<header>`,
top bar, `<footer>` and floating-buttons markup as-is, and add a link to
it in the `nav.links` block and footer "Site" column of every other page.

## Photography

The showroom, sofa, bed, wardrobe, dining, office and repair photos in
`assets/img/` are stock photography (Unsplash) used as stand-ins so the
site doesn't launch with empty placeholders. Swap in real photos of the
Sharma Furniture showroom and stock whenever they're available — same
filenames, same folder, and every page that references them will pick
up the new image automatically.
# sharma-furniture
