import React from 'react';
import { render } from '@testing-library/react';

// Mock do DashboardLayout
jest.mock('../components/DashboardLayout', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="dashboard-layout">{children}</div>
  };
});

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => <div data-testid="test-wrapper">{children}</div>,
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render }; 