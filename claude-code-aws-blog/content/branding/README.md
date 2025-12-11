# AWS Branding Assets for Claude Code Workshop

This directory contains branding assets and guidelines for the Claude Code on AWS workshop and blog.

## AWS Brand Guidelines

All branding must comply with [AWS Trademark Guidelines](https://aws.amazon.com/trademark-guidelines/).

### Color Palette

```css
/* Primary AWS Colors */
--aws-orange: #FF9900;     /* AWS Orange - Primary brand color */
--aws-dark: #232F3E;       /* AWS Dark - Primary text, headers */
--aws-blue: #146EB4;       /* AWS Blue - Secondary accent */

/* Supporting Colors */
--aws-light-gray: #F2F3F3; /* Backgrounds, dividers */
--aws-dark-gray: #545B64;  /* Secondary text */
--aws-squid-ink: #16191F;  /* Deep dark for contrast */

/* Semantic Colors */
--aws-green: #1D8102;      /* Success states */
--aws-red: #D13212;        /* Error states, warnings */
--aws-yellow: #FF9900;     /* Alerts, highlights */
```

### Typography

**Primary Font**: Amazon Ember (fallback to system fonts)

```css
font-family: "Amazon Ember", -apple-system, BlinkMacSystemFont, "Segoe UI",
             "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
             "Droid Sans", "Helvetica Neue", sans-serif;
```

**Font Sizes**:
- Hero Heading: 48-72px (3rem - 4.5rem)
- Page Heading: 32-48px (2rem - 3rem)
- Section Heading: 24-32px (1.5rem - 2rem)
- Body Text: 16-18px (1rem - 1.125rem)
- Small Text: 14px (0.875rem)

### Logo Usage

#### AWS Logo Specifications

**Required**: AWS logo must include proper spacing and not be modified.

**Placement**:
- Header: Top left, 120x40px
- Footer: Centered, 80x27px
- Hero Section: Centered, 160x53px

**Clear Space**: Minimum spacing of 20px on all sides

**Color Variations**:
- White logo on dark backgrounds (#232F3E)
- Dark logo on light backgrounds (#FFFFFF)
- Orange logo for accent areas (#FF9900 backgrounds)

#### Claude Code Logo

**Text Treatment**: "Claude Code" should use:
- Font Weight: 700 (Bold)
- Color: AWS Orange (#FF9900) or AWS Dark (#232F3E)
- Size: Proportional to context

## Asset Files

### Logos

Create or obtain these assets:

1. **aws-logo-dark.svg** - AWS logo for light backgrounds
2. **aws-logo-light.svg** - AWS logo for dark backgrounds
3. **aws-logo-orange.svg** - AWS logo on orange backgrounds
4. **favicon.ico** - 32x32 and 16x16 AWS-themed favicon
5. **apple-touch-icon.png** - 180x180 for iOS devices

### Open Graph Images

**Dimensions**: 1200x630px (1.91:1 ratio)

Templates needed:
1. **og-default.png** - Default blog OG image
2. **og-tutorial.png** - Tutorial category OG image
3. **og-guide.png** - Guide category OG image
4. **og-reference.png** - Reference category OG image

**OG Image Template Structure**:
```
┌─────────────────────────────────────────┐
│  AWS Orange Gradient Background         │
│  (#FF9900 to #232F3E)                   │
│                                         │
│  [AWS Logo]         [Claude Code Logo]  │
│                                         │
│  Blog Post Title Here                   │
│  (Bold, 48px, White)                    │
│                                         │
│  Brief excerpt or category              │
│  (Regular, 24px, White 80%)             │
│                                         │
│  aws.amazon.com/blogs                   │
└─────────────────────────────────────────┘
```

### Social Media Templates

**Twitter Card**: 1200x675px
**LinkedIn Post**: 1200x627px
**Workshop Thumbnail**: 1280x720px

### Placeholder Images

For blog posts without custom images:

1. **blog-placeholder-bedrock.jpg** - AWS Bedrock themed
2. **blog-placeholder-mcp.jpg** - MCP/integration themed
3. **blog-placeholder-cicd.jpg** - CI/CD/automation themed
4. **blog-placeholder-generic.jpg** - Generic AWS cloud themed

**Placeholder Specifications**:
- Dimensions: 1200x630px
- Format: JPEG (optimized for web)
- File Size: < 200KB
- Theme: AWS orange gradient with relevant icons

## Icon Set

### Custom Icons Needed

1. **claude-icon.svg** - Claude Code icon (24x24, 32x32, 48x48)
2. **mcp-icon.svg** - MCP server icon
3. **bedrock-icon.svg** - AWS Bedrock icon
4. **hook-icon.svg** - Hook system icon
5. **command-icon.svg** - Custom command icon

**Icon Style**:
- Line weight: 2px
- Color: AWS Orange (#FF9900) or AWS Dark (#232F3E)
- Style: Outlined, consistent with AWS design language
- Export: SVG with viewBox="0 0 24 24"

## Usage Examples

### Header with AWS Branding

```tsx
import Image from "next/image";

export function Header() {
  return (
    <header className="bg-aws-dark border-b border-aws-dark-gray">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Image
          src="/images/aws-logo-light.svg"
          alt="AWS"
          width={120}
          height={40}
          priority
        />
        <h1 className="text-aws-orange text-xl font-bold">
          Claude Code Workshop
        </h1>
      </div>
    </header>
  );
}
```

### Open Graph Meta Tags

```tsx
export const metadata = {
  title: "Getting Started with Claude Code on AWS Bedrock",
  openGraph: {
    title: "Getting Started with Claude Code on AWS Bedrock",
    description: "Learn how to set up and use Claude Code with AWS Bedrock",
    images: [
      {
        url: "/images/og-tutorial.png",
        width: 1200,
        height: 630,
        alt: "Claude Code on AWS Bedrock Tutorial",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Getting Started with Claude Code on AWS Bedrock",
    description: "Learn how to set up and use Claude Code with AWS Bedrock",
    images: ["/images/og-tutorial.png"],
  },
};
```

### Hero Section with Gradient

```tsx
<section className="relative overflow-hidden bg-gradient-to-br from-aws-dark via-aws-dark to-aws-blue py-20">
  <div className="absolute inset-0 bg-gradient-to-r from-aws-orange/10 to-transparent" />
  <div className="container relative mx-auto px-4 text-center">
    <h1 className="mb-6 text-5xl font-bold text-white">
      Build AI-Powered Applications with{" "}
      <span className="text-aws-orange">Claude Code</span> on AWS
    </h1>
  </div>
</section>
```

## Figma Templates

For workshop instructors creating custom assets, Figma templates are available:

1. **Blog Post Template**: Complete blog post layout with AWS branding
2. **OG Image Template**: Social media preview template
3. **Workshop Slide Deck**: Presentation template for instructors
4. **Screenshot Guidelines**: Templates for consistent screenshot styling

## Asset Checklist

Before workshop delivery, ensure:

- [ ] AWS logos in all required formats (SVG, PNG)
- [ ] Favicon and touch icons generated
- [ ] OG images for all blog posts
- [ ] Placeholder images for content without custom images
- [ ] Icon set exported in all required sizes
- [ ] All assets optimized for web (compressed)
- [ ] Assets comply with AWS trademark guidelines
- [ ] Attribution and licensing documented

## Optimization Guidelines

### Image Optimization

```bash
# Optimize PNG files
pngquant --quality=65-80 *.png

# Optimize JPEG files
jpegoptim --max=85 *.jpg

# Optimize SVG files
svgo --multipass *.svg
```

### Next.js Image Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

## Legal and Compliance

### Attribution Requirements

When using AWS branding:
1. Include AWS trademark notice in footer
2. Link to AWS trademark guidelines
3. Clear distinction between official AWS content and workshop content

### Trademark Notice

```
Amazon Web Services, AWS, and the AWS logo are trademarks of Amazon.com, Inc.
or its affiliates. This workshop is not affiliated with or endorsed by AWS.
```

## Resources

- [AWS Trademark Guidelines](https://aws.amazon.com/trademark-guidelines/)
- [AWS Brand Portal](https://aws.amazon.com/brand/) (requires AWS account)
- [Anthropic Claude Brand Assets](https://www.anthropic.com/brand)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

## Contact

For questions about branding assets or AWS trademark usage:
- Workshop Instructors: [instructor-email]
- AWS Partner Support: [aws-support-link]
