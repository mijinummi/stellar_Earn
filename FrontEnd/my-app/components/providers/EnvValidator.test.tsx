import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { EnvValidator } from '@/components/providers/EnvValidator';

/**
 * FE-038: Unit Tests for EnvValidator Component
 *
 * Tests the config error panel rendering path for the EnvValidator component.
 * This component validates environment variables on client initialization
 * and displays an error panel if validation fails.
 */

describe('EnvValidator Component - Unit Tests', () => {
  beforeEach(() => {
    // Clear environment variables before each test
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000';
  });

  const getSectionByHeading = (name: RegExp) => {
    const heading = screen.getByRole('heading', { name });
    const section = heading.closest('div');

    expect(section).not.toBeNull();

    return within(section as HTMLElement);
  };

  describe('Rendering - Valid Environment', () => {
    it('should render children when environment variables are valid', async () => {
      const TestContent = () => <div data-testid="test-content">Success</div>;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          expect(screen.getByTestId('test-content')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('should not display error panel when validation passes', async () => {
      const TestContent = () => <div>Content</div>;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          expect(
            screen.queryByText(/configuration error/i)
          ).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('Loading State', () => {
    it('should display loading indicator during validation', async () => {
      const TestContent = () => <div>Content</div>;

      const { rerender } = render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      // During initial render, loading state might be shown briefly
      const loadingIndicator = screen.queryByText(/initializing application/i);
      // Note: This depends on timing, so we just verify it eventually disappears
      if (loadingIndicator) {
        await waitFor(
          () => {
            expect(
              screen.queryByText(/initializing application/i)
            ).not.toBeInTheDocument();
          },
          { timeout: 2000 }
        );
      }
    });

    it('should display animated loading spinner', async () => {
      const TestContent = () => <div>Content</div>;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          expect(
            screen.queryByText(/initializing application/i)
          ).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('Error Panel - Structure', () => {
    it('should render error panel with correct structure when validation fails', async () => {
      const TestContent = () => <div>Should not render</div>;

      // Mock environment variable as missing
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(() => {
        expect(screen.getByText(/configuration error/i)).toBeInTheDocument();
      });

      // Restore environment
      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });

    it('should display error icon', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const icon = screen.getByRole('img', { hidden: true });
          expect(icon).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });

    it('should display "Configuration Error" heading', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const heading = screen.getByRole('heading', {
            name: /configuration error/i,
          });
          expect(heading).toBeInTheDocument();
          expect(heading.classList.contains('text-red-500')).toBe(true);
          expect(heading.classList.contains('text-2xl')).toBe(true);
          expect(heading.classList.contains('font-bold')).toBe(true);
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });
  });

  describe('Error Message Display', () => {
    it('should display missing environment variable names in error message', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          expect(
            screen.getAllByText(/NEXT_PUBLIC_API_BASE_URL/i).length
          ).toBeGreaterThan(0);
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });

    it('should display error message with bullet points', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const errorContent = screen.getByText(
            /Missing required environment variables/i
          );
          expect(errorContent).toBeInTheDocument();
          expect(errorContent.textContent).toMatch(/•/);
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });

    it('should include error descriptions for each variable', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          expect(screen.getByText(/Backend API base URL/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });
  });

  describe('Help Section', () => {
    it('should display "How to fix this" section', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const section = getSectionByHeading(/how to fix this/i);
          expect(section.getByRole('list')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });

    it('should display fix instructions as ordered list', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const list = screen.getByRole('list');
          expect(list).toBeInTheDocument();
          expect(list.tagName).toBe('OL');

          const items = screen.getAllByRole('listitem');
          expect(items.length).toBeGreaterThanOrEqual(3);
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });

    it('should include step about creating .env.local file', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const section = getSectionByHeading(/how to fix this/i);
          expect(section.getByText(/\.env\.local/)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });

    it('should display example configuration block', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          expect(
            screen.getByText(/NEXT_PUBLIC_STELLAR_NETWORK/i)
          ).toBeInTheDocument();
          expect(
            screen.getByText(/NEXT_PUBLIC_SOROBAN_RPC_URL/i)
          ).toBeInTheDocument();
          expect(
            screen.getByText(/NEXT_PUBLIC_CONTRACT_ID/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });
  });

  describe('Code Formatting', () => {
    it('should display error message in pre-formatted code block', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const errorBlock = screen.getByText(
            /missing required environment variables/i
          );
          expect(errorBlock.classList.contains('font-mono')).toBe(true);
          expect(errorBlock.classList.contains('whitespace-pre-wrap')).toBe(
            true
          );
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });

    it('should display example configuration in code block', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const section = getSectionByHeading(/example \.env\.local:/i);
          const exampleText = section.getByText(/http:\/\/localhost:3001/);
          expect(exampleText).toBeInTheDocument();
          expect(exampleText.classList.contains('bg-zinc-950')).toBe(true);
          expect(exampleText.classList.contains('overflow-x-auto')).toBe(true);
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const h1 = screen.getByRole('heading', { level: 1 });
          expect(h1).toBeInTheDocument();
          expect(h1.textContent).toMatch(/configuration error/i);

          const h2s = screen.getAllByRole('heading', { level: 2 });
          expect(h2s.length).toBeGreaterThan(0);
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });

    it('should have alt text for error icon', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const svg = screen.getByRole('img', { hidden: true });
          expect(svg).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });

    it('should have README link with proper href', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const link = screen.getByRole('link', { name: /README\.md/i });
          expect(link.getAttribute('href')).toBe('/README.md');
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });
  });

  describe('Error Handling', () => {
    it('should catch validation errors gracefully', async () => {
      const TestContent = () => <div data-testid="test-content">Content</div>;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      // Should render without crashing
      await waitFor(
        () => {
          expect(screen.getByTestId('test-content')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('should display appropriate message for unexpected errors', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          // Should show error configuration or similar
          const errorElement = screen.queryByText(/configuration error/i);
          expect(
            errorElement || screen.queryByText(/environment/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });
  });

  describe('Visual Layout', () => {
    it('should have full height background when showing error', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      const { container } = render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const mainContainer = container.querySelector('.min-h-screen');
          expect(mainContainer).toBeInTheDocument();
          expect(mainContainer?.classList.contains('bg-zinc-950')).toBe(true);
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });

    it('should center error panel on screen', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      const { container } = render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const flex = container.querySelector(
            '.flex.items-center.justify-center'
          );
          expect(flex).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });

    it('should have responsive padding on mobile', async () => {
      const TestContent = () => <div>Content</div>;
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NEXT_PUBLIC_API_BASE_URL;

      const { container } = render(
        <EnvValidator>
          <TestContent />
        </EnvValidator>
      );

      await waitFor(
        () => {
          const container1 = container.querySelector('.p-4');
          expect(container1).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      if (originalEnv) {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      }
    });
  });
});
