import { describe, it, expect } from 'vitest';
import { formatCurrency } from './utils';

describe('Utils Functions', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(15000).replace(/\u00A0/g, ' ')).toBe('Rp 15.000');
    expect(formatCurrency(0).replace(/\u00A0/g, ' ')).toBe('Rp 0');
  });
});
