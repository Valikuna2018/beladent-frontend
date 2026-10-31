# BelaDent production deployment

The repository contains a Render Blueprint in `render.yaml`.

1. Create the backend Blueprint first and wait for its health check to pass.
2. Create this frontend Blueprint.
3. In the domain registrar, point `beladent.ge` and `www.beladent.ge` to the DNS targets shown by Render.
4. Verify the public site, both languages, mobile navigation, images, forms and the private `/Security` page.

The production API URL is injected at build time through `VITE_API_URL`.
