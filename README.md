# India CompuTech Website

A modern, responsive website for India CompuTech, designed with a red and black color scheme matching the company logo.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Smooth Scrolling**: Enhanced navigation with smooth scroll effects
- **Interactive Elements**: Hover effects, animations, and dynamic counters
- **Mobile Menu**: Hamburger menu for mobile navigation
- **SEO Friendly**: Semantic HTML structure

## File Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # All styling and responsive design
├── script.js           # JavaScript for interactivity
├── README.md           # This file
└── India CompuTech Logo Red.png  # Company logo
```

## Customization

### Update Contact Information

Edit the footer section in `index.html` to update:
- Company address
- Phone number
- Email address

### Modify Services

Update the services sections in `index.html`:
- Main service cards (lines ~80-100)
- "What We Do" section (lines ~110-150)

### Change Statistics

Update the statistics in the statistics section:
- Years of experience
- Lines of code
- Technologies count

### Add Client Logos

Replace the placeholder client items with actual client logos or names in the clients section.

### Color Scheme

The website uses the following color variables (defined in `styles.css`):
- Primary Red: `#DC143C`
- Dark Red: `#B71C1C`
- Black: `#000000`

You can modify these in the `:root` section of `styles.css` to match your brand colors.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Getting Started

1. Open `index.html` in a web browser
2. For development, use a local server (recommended):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

## Notes

- Make sure the logo file `India CompuTech Logo Red.png` is in the same directory as `index.html`
- Update placeholder content with your actual company information
- Test the website on different devices to ensure responsive design works correctly

