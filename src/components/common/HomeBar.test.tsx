import { describe, expect, it, test, vi } from 'vitest';
import HomeBar from './HomeBar';
import { render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({ t: (key: string) => key })),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));
describe('HomeBar component', () => {
  it('renders the Login button', () => {
    const mockRefetch = vi.fn();
    render(<HomeBar refetch={mockRefetch} />);
    const loginButton = screen.getByRole('button', { name: 'LOGIN' });
    expect(loginButton).not.toBeNull();
  });
});
