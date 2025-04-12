import '@testing-library/jest-dom';

// Mock do ResizeObserver que é usado pelo Framer Motion
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})); 