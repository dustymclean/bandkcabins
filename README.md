# B & K Cabins — premium woodland hospitality website

A polished, responsive static website for **bandkcabins.com**, built around the owner's original Wix copy, with additional search-friendly context. Contact inquiries go to Tina directly; there is **no fake booking engine, fabricated reviews, or payment collection**.

## Upload to GitHub (dustymclean/bandkcabins)
1. Download and **unzip** the delivery archive. Do not upload the .zip itself to GitHub Pages.
2. Open https://github.com/dustymclean/bandkcabins and choose **Add file > Upload files**.
3. Drag **everything INSIDE the unzipped folder** onto the upload page, including `index.html`, `CNAME`, `assets/`, and the `the-cabin/`, `amenities/`, `photos/`, `faq/`, and `contact/` folders. GitHub's web uploader may not accept hidden `.github` folders reliably—see step 4.
4. If the `.github/workflows/deploy.yml` file did not upload, manually create it at that path from the extracted archive, or publish from main branch `/ (root)` in **Settings > Pages** instead.
5. In **Settings > Pages**, select **GitHub Actions** if the workflow exists, or **Deploy from a branch > main > /(root)** for simpler branch publishing.
6. Confirm GitHub Pages' **Custom domain** is `bandkcabins.com` (the repository's `CNAME` file already contains this).
7. In Porkbun DNS, set apex A records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and `www` CNAME to `dustymclean.github.io`. Remove *conflicting web A/AAAA/CNAME records* only. **Keep MX/SPF/DKIM/DMARC email records.**
8. Allow DNS/certificate provisioning, check that both `https://bandkcabins.com` and `https://www.bandkcabins.com` work, then enable Enforce HTTPS.
9. Register Google Search Console and submit `https://bandkcabins.com/sitemap.xml`.

## Photos
`assets/photos.json`, `assets/photos.js`, and `assets/image-manifest.csv` preserve original Wix media identifiers. **This package currently references Wix-hosted originals; the photographs have NOT been restored/enhanced offline.** The site includes a standalone enhancement utility `tools/recover_and_enhance.py` for future authenticated/network-enabled use, but DO NOT run `tools/build.py` against the finished site because it is a legacy first-pass generator. The Oct 23–25 photo shoot will be the right time to add stronger local images.

## Verify before accepting bookings
Published source copy says six sleeping spots, while other listings may differ. Confirm approved guest limit, rates, cleaning fees, cancellation, pet rules, event policies, safety information and accessibility details directly with Tina. Do not publish unsupported claims.

## Contents
- `index.html`: destination homepage
- `the-cabin/`, `amenities/`, `photos/`, `faq/`, `contact/`: interior pages
- `assets/`: emblem, stylesheet, photo references, and gallery script
- `.github/workflows/deploy.yml`: GitHub Actions deployment
- `CNAME`, `robots.txt`, `sitemap.xml`, `404.html`: hosting and SEO
