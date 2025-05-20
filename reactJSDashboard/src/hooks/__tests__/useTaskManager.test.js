import { renderHook, act } from '@testing-library/react';
import { useTaskManager } from '../useTaskManager';

// Mock data
const mockTasks = [
  { id: 1, title: 'Task 1', deadline: '2025-05-18T10:00:00Z', priority: 'high' },
  { id: 2, title: 'Task 2', deadline: '2025-05-22T10:00:00Z', priority: 'medium' },
  { id: 3, title: 'Task 3', deadline: '2025-05-19T10:00:00Z', priority: 'low' },
];

// Mock the fetch API
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockTasks),
  })
);

// Mock local storage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useTaskManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });
  
  test('loads tasks and sets initial state correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTaskManager());
    
    // Initially should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for data to load
    await waitForNextUpdate();
    
    // Check final state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.filter).toBe('all');
  });
  
  test('filters tasks correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTaskManager());
    
    await waitForNextUpdate();
    
    // Initially should show all tasks
    expect(result.current.allTasks.length).toBe(mockTasks.length);
    
    // Test filter change
    act(() => {
      result.current.setFilter('high');
    });
    
    // Wait for debounced update
    jest.advanceTimersByTime(300);
    
    // Should only show high priority tasks
    expect(result.current.filter).toBe('high');
  });
  
  test('handles pagination correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTaskManager());
    
    await waitForNextUpdate();
    
    // Test pagination
    expect(result.current.pagination.page).toBe(1);
    
    act(() => {
      result.current.pagination.nextPage();
    });
    
    expect(result.current.pagination.page).toBe(2);
    
    act(() => {
      result.current.pagination.prevPage();
    });
    
    expect(result.current.pagination.page).toBe(1);
    
    act(() => {
      result.current.pagination.goToPage(2);
    });
    
    expect(result.current.pagination.page).toBe(2);
  });
  
  test('uses cache when available and not expired', async () => {
    // Set up mock cache
    const cachedData = {
      data: mockTasks,
      timestamp: new Date().getTime() // Fresh timestamp
    };
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));
    
    const { result, waitForNextUpdate } = renderHook(() => useTaskManager());
    
    await waitForNextUpdate();
    
    // Should use cache and not make fetch call
    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.allTasks).toEqual(mockTasks);
  });
  
  test('fetches fresh data when cache is expired', async () => {
    // Set up expired mock cache (6 minutes old)
    const cachedData = {
      data: [],
      timestamp: new Date().getTime() - 6 * 60 * 1000 // 6 minutes ago
    };
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cachedData));
    
    const { result, waitForNextUpdate } = renderHook(() => useTaskManager());
    
    await waitForNextUpdate();
    
    // Should fetch fresh data
    expect(fetch).toHaveBeenCalledWith('/data/mockdata.json');
  });
});