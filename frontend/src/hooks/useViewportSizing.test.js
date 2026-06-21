import { renderHook, act } from '@testing-library/react';
import { useViewportSizing } from './useViewportSizing';
import { vi } from 'vitest';

describe('useViewportSizing Hook', () => {
  beforeEach(() => {
    // Hijack the browser's clock to instantly fast-forward our debounce timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should mathematically calculate the correct limit and clamp at the minimum of 5', () => {
    // 1. Simulate a large monitor
    window.innerHeight = 1000;
    
    // Mount the hook (Math: (1000 - 380 offset) / 53 row height = 11.69 -> 11 rows)
    const { result } = renderHook(() => useViewportSizing(53, 380));
    expect(result.current).toBe(11);

    // 2. Simulate dragging the window smaller
    act(() => {
      window.innerHeight = 500;
      window.dispatchEvent(new Event('resize'));
      
      // Fast-forward the 150ms debounce we wrote!
      vi.advanceTimersByTime(200); 
    });

    // Math: (500 - 380) / 53 = 2.26. Our clamp should catch this and force it to 5!
    expect(result.current).toBe(5); 
  });
});