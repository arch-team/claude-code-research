import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "AWS Claude Code Blog",
  description: "A blog about building AI-powered applications with Claude Code on AWS",
  keywords: ["AWS", "Claude Code", "AI", "Machine Learning", "Bedrock", "Development"],
  authors: [{ name: "AWS Workshop" }],
  openGraph: {
    title: "AWS Claude Code Blog",
    description: "Learn to build AI-powered applications with Claude Code on AWS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* AWS Theme Variables - Inline to bypass MIME type issues with CloudFront proxy */
            :root {
              --aws-orange: #FF9900;
              --aws-dark: #232F3E;
              --aws-blue: #146EB4;
              --aws-light-gray: #F2F3F3;
              --aws-dark-gray: #545B64;
            }

            * { box-sizing: border-box; margin: 0; padding: 0; }

            body {
              font-family: ui-sans-serif, system-ui, sans-serif;
              background: #ffffff;
              color: #232F3E;
              line-height: 1.6;
              min-height: 100vh;
              display: flex;
              flex-direction: column;
            }

            .bg-aws-orange { background-color: var(--aws-orange); }
            .bg-aws-dark { background-color: var(--aws-dark); }
            .bg-aws-blue { background-color: var(--aws-blue); }
            .text-white { color: white; }
            .text-aws-dark-gray { color: var(--aws-dark-gray); }
            .text-aws-light-gray { color: var(--aws-light-gray); }

            .container { max-width: 1200px; margin: 0 auto; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
            .px-8 { padding-left: 2rem; padding-right: 2rem; }
            .px-12 { padding-left: 3rem; padding-right: 3rem; }
            .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
            .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
            .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
            .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
            .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
            .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
            .p-12 { padding: 3rem; }
            .mb-16 { margin-bottom: 4rem; }
            .mb-8 { margin-bottom: 2rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mt-auto { margin-top: auto; }

            .text-center { text-align: center; }
            .text-6xl { font-size: 3.75rem; line-height: 1; }
            .text-5xl { font-size: 3rem; line-height: 1; }
            .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
            .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
            .text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }

            .rounded-lg { border-radius: 0.5rem; }
            .rounded-2xl { border-radius: 1rem; }
            .rounded-3xl { border-radius: 1.5rem; }
            .flex-1 { flex: 1 1 0%; }
            .inline-block { display: inline-block; }
            .no-underline { text-decoration: none; }
            .max-w-4xl { max-width: 56rem; }

            /* Button and link styles */
            a {
              text-decoration: none;
            }

            button, a.btn {
              cursor: pointer;
              border: none;
              transition: all 0.3s ease;
              display: inline-block;
            }

            .bg-aws-dark:hover {
              background-color: var(--aws-blue);
            }

            /* Fade-in animation */
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .animate-fadeIn {
              animation: fadeIn 0.8s ease-out forwards;
            }

            .animation-delay-200 {
              animation-delay: 0.2s;
              opacity: 0;
            }

            /* Button hover effects */
            .btn.bg-aws-dark {
              transition: background-color 0.3s ease, transform 0.2s ease;
            }

            .btn.bg-aws-dark:hover {
              background-color: #146EB4;
              transform: translateY(-2px);
            }

            /* Post card styles */
            .post-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 2rem;
            }

            .post-card {
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 0.75rem;
              padding: 2rem;
              transition: all 0.3s ease;
              cursor: pointer;
              display: flex;
              flex-direction: column;
            }

            .post-card:hover {
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
              transform: translateY(-2px);
            }

            .category-badge {
              display: inline-block;
              background: var(--aws-orange);
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 1.5rem;
              font-size: 0.75rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-bottom: 1rem;
              width: fit-content;
            }

            .post-title {
              font-size: 1.5rem;
              font-weight: 700;
              color: var(--aws-dark);
              margin-bottom: 1rem;
              line-height: 1.3;
            }

            .post-excerpt {
              color: var(--aws-dark-gray);
              margin-bottom: 1.5rem;
              line-height: 1.6;
              flex-grow: 1;
            }

            .post-meta {
              font-size: 0.875rem;
              color: var(--aws-dark-gray);
              margin-bottom: 1rem;
            }

            .post-meta .author {
              font-style: italic;
            }

            .post-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
            }

            .tag-badge {
              display: inline-block;
              background: var(--aws-light-gray);
              color: var(--aws-dark-gray);
              padding: 0.375rem 0.75rem;
              border-radius: 0.375rem;
              font-size: 0.75rem;
              font-weight: 500;
            }

            .mb-2 { margin-bottom: 0.5rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .gap-8 { gap: 2rem; }
            .mt-16 { margin-top: 4rem; }
            .pt-8 { padding-top: 2rem; }

            /* Markdown prose styles */
            .prose {
              max-width: 65ch;
              color: var(--aws-dark);
              line-height: 1.7;
            }

            .prose h1 {
              font-size: 2.25rem;
              font-weight: 700;
              margin-top: 2rem;
              margin-bottom: 1rem;
              color: var(--aws-dark);
            }

            .prose h2 {
              font-size: 1.875rem;
              font-weight: 700;
              margin-top: 2rem;
              margin-bottom: 1rem;
              color: var(--aws-dark);
            }

            .prose h3 {
              font-size: 1.5rem;
              font-weight: 600;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
              color: var(--aws-dark);
            }

            .prose p {
              margin-bottom: 1.25rem;
            }

            .prose ul, .prose ol {
              margin-bottom: 1.25rem;
              padding-left: 1.5rem;
            }

            .prose li {
              margin-bottom: 0.5rem;
            }

            .prose code {
              background: var(--aws-light-gray);
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-size: 0.9em;
              font-family: ui-monospace, 'Fira Code', monospace;
            }

            .prose pre {
              background: var(--aws-dark);
              color: var(--aws-light-gray);
              padding: 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin-bottom: 1.25rem;
            }

            .prose pre code {
              background: transparent;
              padding: 0;
              color: inherit;
            }

            .prose a {
              color: var(--aws-blue);
              text-decoration: underline;
            }

            .prose a:hover {
              color: var(--aws-orange);
            }

            .prose strong {
              font-weight: 600;
              color: var(--aws-dark);
            }

            .prose blockquote {
              border-left: 4px solid var(--aws-orange);
              padding-left: 1rem;
              margin: 1.5rem 0;
              color: var(--aws-dark-gray);
              font-style: italic;
            }

            .prose table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1.25rem;
            }

            .prose th, .prose td {
              border: 1px solid #e5e7eb;
              padding: 0.75rem;
              text-align: left;
            }

            .prose th {
              background: var(--aws-light-gray);
              font-weight: 600;
            }

            /* Header Navigation Styles */
            .header-nav {
              background: white;
              border-bottom: 2px solid var(--aws-orange);
              position: sticky;
              top: 0;
              z-index: 50;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            .nav-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              gap: 1rem;
            }

            .logo-link {
              text-decoration: none;
              transition: opacity 0.3s ease;
            }

            .logo-link:hover {
              opacity: 0.8;
            }

            .logo-container {
              display: flex;
              align-items: center;
              gap: 0.75rem;
            }

            .logo-text {
              font-size: 1.5rem;
              font-weight: 700;
              color: var(--aws-orange);
              letter-spacing: 0.05em;
            }

            .logo-divider {
              color: var(--aws-dark-gray);
              font-weight: 300;
            }

            .logo-subtext {
              font-size: 1rem;
              font-weight: 600;
              color: var(--aws-dark);
            }

            .nav-links {
              display: flex;
              gap: 2rem;
              align-items: center;
            }

            .nav-link {
              color: var(--aws-dark);
              font-weight: 500;
              font-size: 1rem;
              text-decoration: none;
              padding: 0.5rem 0;
              border-bottom: 2px solid transparent;
              transition: all 0.3s ease;
            }

            .nav-link:hover {
              color: var(--aws-orange);
              border-bottom-color: var(--aws-orange);
            }

            /* Responsive design */
            @media (max-width: 1024px) {
              .post-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }

            @media (max-width: 768px) {
              .text-6xl { font-size: 2.5rem; }
              .text-5xl { font-size: 2rem; line-height: 1.2; }
              .text-4xl { font-size: 1.875rem; }
              .text-xl { font-size: 1.125rem; line-height: 1.6; }

              /* Hero section mobile adjustments */
              .py-20 { padding-top: 3rem; padding-bottom: 3rem; }
              .px-8 { padding-left: 1.5rem; padding-right: 1.5rem; }
              .px-6 { padding-left: 1rem; padding-right: 1rem; }
              .mb-8 { margin-bottom: 1.5rem; }
              .mb-6 { margin-bottom: 1rem; }

              /* Header navigation mobile */
              .nav-container {
                flex-direction: column;
                align-items: flex-start;
              }

              .logo-text {
                font-size: 1.25rem;
              }

              .logo-subtext {
                font-size: 0.875rem;
              }

              .nav-links {
                width: 100%;
                gap: 1rem;
                padding-top: 0.5rem;
              }

              /* Post grid mobile */
              .post-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
              }

              .post-card {
                padding: 1.5rem;
              }
            }
          `
        }} />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-aws-dark text-aws-light-gray py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              Built with Claude Code on AWS | Workshop Exercise
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
