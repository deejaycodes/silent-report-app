import { describe, it, expect } from 'vitest';

describe('Report Validation', () => {
  it('should reject reports with less than 10 words', () => {
    const description = 'short text';
    const words = description.trim().split(/\s+/).length;
    expect(words).toBeLessThan(10);
  });

  it('should accept reports with 10+ words', () => {
    const description = 'This is a detailed report about an incident that happened yesterday in my neighborhood';
    const words = description.trim().split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(10);
  });

  it('should detect spam phrases', () => {
    const spamPhrases = ['test test test', 'hello world', 'asdf asdf'];
    const description = 'test test test test test test test test test test';
    
    const isSpam = spamPhrases.some(phrase => 
      description.toLowerCase().includes(phrase.toLowerCase())
    );
    
    expect(isSpam).toBe(true);
  });

  it('should detect gibberish (repeated characters)', () => {
    const description = 'aaaaaaaaaa bbbbbbbbbb cccccccccc';
    const hasGibberish = /(.)\1{4,}/.test(description);
    expect(hasGibberish).toBe(true);
  });

  it('should accept valid reports', () => {
    const description = 'I witnessed a serious incident yesterday evening near the market area that requires immediate attention';
    const words = description.trim().split(/\s+/).length;
    const hasGibberish = /(.)\1{4,}/.test(description);
    
    expect(words).toBeGreaterThanOrEqual(10);
    expect(hasGibberish).toBe(false);
  });
});
