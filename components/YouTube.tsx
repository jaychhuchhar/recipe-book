"use client";

import { useEffect } from 'react';

export function YouTube({ id, title }: { id: string; title?: string }) {
  const url = `https://www.youtube.com/watch?v=${id}`;
  const embed = `https://www.youtube.com/embed/${id}`;

  useEffect(() => {
    // Inject CSS custom properties for theme support
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --yt-card-bg-light: #fff;
        --yt-card-bg-dark: #232329;
        --yt-heading-light: #222;
        --yt-heading-dark: #f3f3f3;
        --yt-accent-light: #333;
        --yt-accent-dark: #e0e0e0;
        --yt-text-light: #555;
        --yt-text-dark: #e0e0e0;
        --yt-link-light: #2563eb;
        --yt-link-dark: #60a5fa;
      }
      html.dark {
        --yt-card-bg: var(--yt-card-bg-dark);
        --yt-heading: var(--yt-heading-dark);
        --yt-accent: var(--yt-accent-dark);
        --yt-text: var(--yt-text-dark);
        --yt-link: var(--yt-link-dark);
      }
      html:not(.dark) {
        --yt-card-bg: var(--yt-card-bg-light);
        --yt-heading: var(--yt-heading-light);
        --yt-accent: var(--yt-accent-light);
        --yt-text: var(--yt-text-light);
        --yt-link: var(--yt-link-light);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
      
      <div className="my-4">
        {title && (
          <h3 
            style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--yt-heading)'
            }}
          >
            {title}
          </h3>
        )}

        <p 
          style={{ 
            fontSize: '0.875rem', 
            color: 'var(--yt-text)', 
            marginBottom: '0.5rem' 
          }}
        >
          Original YouTube Video:{" "}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--yt-link)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Watch on YouTube
          </a>{" "}
          or here:
        </p>

        <div 
          style={{ 
            width: '100%', 
            aspectRatio: '16 / 9',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <iframe
            style={{ 
              width: '100%', 
              height: '100%',
              border: 'none'
            }}
            src={embed}
            title={title || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
  );
}
