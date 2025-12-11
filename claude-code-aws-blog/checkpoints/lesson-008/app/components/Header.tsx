import { withBasePath } from '../lib/basePath';

/**
 * AWS-themed navigation header
 * Server component - no client-side JavaScript
 */
export default function Header() {
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Posts', href: '/posts' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="header-nav">
      <div className="container mx-auto px-4 py-4">
        <nav className="nav-container">
          {/* Logo Area */}
          <a href={withBasePath('/')} className="logo-link">
            <div className="logo-container">
              <span className="logo-text">AWS</span>
              <span className="logo-divider">|</span>
              <span className="logo-subtext">Claude Code Blog</span>
            </div>
          </a>

          {/* Navigation Links */}
          <div className="nav-links">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={withBasePath(link.href)}
                className="nav-link"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
