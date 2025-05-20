import { getUrgencyScore, priorityColor, isOverdue } from '../sortUtils';

describe('sortUtils', () => {
  // Mock current date to have deterministic test results
  const mockDate = new Date('2025-05-20T10:00:00Z');
  
  beforeAll(() => {
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });
  
  afterAll(() => {
    jest.restoreAllMocks();
  });
  
  describe('getUrgencyScore', () => {
    test('calculates higher urgency (lower score) for high priority tasks', () => {
      const highPriorityTask = {
        deadline: '2025-05-22T10:00:00Z', // 2 days away
        priority: 'high'
      };
      
      const mediumPriorityTask = {
        deadline: '2025-05-22T10:00:00Z', // same deadline
        priority: 'medium'
      };
      
      const lowPriorityTask = {
        deadline: '2025-05-22T10:00:00Z', // same deadline
        priority: 'low'
      };
      
      // Lower score = higher urgency
      expect(getUrgencyScore(highPriorityTask)).toBeLessThan(getUrgencyScore(mediumPriorityTask));
      expect(getUrgencyScore(mediumPriorityTask)).toBeLessThan(getUrgencyScore(lowPriorityTask));
    });
    
    test('calculates higher urgency for closer deadlines', () => {
      const soonDeadline = {
        deadline: '2025-05-21T10:00:00Z', // 1 day away
        priority: 'medium'
      };
      
      const laterDeadline = {
        deadline: '2025-05-25T10:00:00Z', // 5 days away
        priority: 'medium'
      };
      
      expect(getUrgencyScore(soonDeadline)).toBeLessThan(getUrgencyScore(laterDeadline));
    });
    
    test('returns negative score for overdue tasks', () => {
      const overdueTask = {
        deadline: '2025-05-19T10:00:00Z', // 1 day overdue
        priority: 'medium'
      };
      
      expect(getUrgencyScore(overdueTask)).toBeLessThan(0);
    });
  });
  
  describe('priorityColor', () => {
    test('returns correct color for each priority level', () => {
      expect(priorityColor('high')).toBe('red');
      expect(priorityColor('medium')).toBe('orange');
      expect(priorityColor('low')).toBe('green');
    });
    
    test('handles unknown priority gracefully', () => {
      expect(priorityColor('unknown')).toBeUndefined();
    });
  });
  
  describe('isOverdue', () => {
    test('identifies overdue tasks correctly', () => {
      expect(isOverdue('2025-05-19T00:00:00Z')).toBe(true);
      expect(isOverdue('2025-05-20T09:59:59Z')).toBe(true);
    });
    
    test('identifies non-overdue tasks correctly', () => {
      expect(isOverdue('2025-05-20T10:00:00Z')).toBe(false);
      expect(isOverdue('2025-05-21T00:00:00Z')).toBe(false);
    });
  });
});