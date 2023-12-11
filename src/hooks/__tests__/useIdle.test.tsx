import { describe, it, expect, vi } from 'vitest';
import { useIdle } from '../useIdle';
import { renderWithProviders } from '../../__testUtils__/testStores';
import { createAuthState, loggedOutState } from '../../__testUtils__/sliceSetups/auth';

const SomePageUsingUseIdleHook = () => {
  useIdle(5000)
  return <div></div>
}

describe('useIdle', () => {

  it('logs out after no activity during timer period', async () => {
    vi.useFakeTimers()

    const { store } = renderWithProviders(<SomePageUsingUseIdleHook/>, { preloadedState: {auth: createAuthState()}} )
    
    vi.advanceTimersByTime(7000)
    await vi.runAllTicks();

    expect(store.getState().auth).toMatchObject(loggedOutState)

    vi.useRealTimers();
  });
});