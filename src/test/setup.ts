import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});