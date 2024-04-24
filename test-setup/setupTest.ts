import '@testing-library/jest-dom/vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

beforeAll(() => {});
afterEach(() => {
  cleanup();
});

afterAll(() => {});
