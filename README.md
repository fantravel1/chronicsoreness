# ChronicSoreness

**The Top Resource for Women's Chronic Pain & Soreness**

A comprehensive, mobile-first, SEO/AEO-optimized megasite providing evidence-based information for women managing chronic pain conditions.

## Live Site

Visit: **https://fantravel1.github.io/chronicsoreness/**

## Features

### Content Coverage
- **Conditions**: Fibromyalgia, Endometriosis, Chronic Fatigue Syndrome, Chronic Pelvic Pain, Autoimmune Conditions, Chronic Migraines
- **Treatments**: Medical treatments, physical therapies, mind-body approaches, complementary therapies
- **Lifestyle**: Pacing strategies, exercise guidelines, sleep optimization, stress management, nutrition
- **Resources**: Symptom trackers, doctor discussion guides, support communities, specialist directories

### Technical Features
- Mobile-first responsive design
- AEO (Answer Engine Optimization) with FAQ schema markup
- SEO optimized with meta tags, Open Graph, and structured data
- Accessible (WCAG compliant with skip links, ARIA labels, semantic HTML)
- Fast loading with optimized CSS and minimal JavaScript
- Print-friendly styles
- Reduced motion support

## Project Structure

```
chronicsoreness/
├── index.html          # Homepage
├── conditions.html     # Chronic pain conditions guide
├── treatments.html     # Treatment options
├── lifestyle.html      # Lifestyle management strategies
├── resources.html      # Tools and support resources
├── about.html          # About page and policies
├── 404.html           # Custom error page
├── favicon.svg        # Site favicon
├── robots.txt         # Search engine directives
├── sitemap.xml        # XML sitemap for SEO
├── css/
│   └── styles.css     # Mobile-first stylesheet
├── js/
│   └── main.js        # Interactive features
└── images/
    └── og-image.svg   # Social sharing image
```

## Deployment

This site is deployed via GitHub Pages. Any push to the main branch will automatically update the live site.

### To Deploy Manually:
1. Push changes to the repository
2. Go to Settings > Pages
3. Select source branch (main) and root folder
4. Save

## Development

### Prerequisites
- No build tools required - pure HTML, CSS, and JavaScript

### Local Development
Simply open `index.html` in a browser, or use a local server:
```bash
python -m http.server 8000
# or
npx serve .
```

### Making Changes
1. Edit HTML files directly
2. CSS is in `css/styles.css` using CSS custom properties
3. JavaScript is in `js/main.js`

## SEO/AEO Features

- **Schema.org Markup**: MedicalWebPage, FAQPage, MedicalCondition schemas
- **FAQ Rich Results**: Structured FAQ data for featured snippets
- **Open Graph Tags**: Optimized social sharing
- **Semantic HTML**: Proper heading hierarchy and landmark roles
- **XML Sitemap**: Auto-generated sitemap for search engines
- **Canonical URLs**: Prevent duplicate content issues

## License

All rights reserved. Content is for educational purposes only.

## Medical Disclaimer

This website provides general information for educational purposes only. It is not intended as medical advice and should not replace consultation with qualified healthcare providers. Always seek professional medical advice for your specific condition.
