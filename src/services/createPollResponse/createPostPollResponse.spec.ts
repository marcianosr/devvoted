import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPostPollResponse } from './createPollResponse';
import { evaluatePollResponse } from './evaluatePollResponse';
import { handleCorrectPollResponse } from './handleCorrectPollResponse';
import { handleWrongPollResponse } from './handleWrongPollResponse';
import { calculateBetXP } from '../calculateXP';
import { calculateDevvotedScore } from '../calculateDevvotedScore';
import { upsertScoresToPollUserPerformance } from '../upsertScoresToPollUserPerformance';
import { getStreakMultiplierIncreaseForBet } from '../multipliers';
import { Poll } from '@/types/db';

// Mock all dependencies
vi.mock('./evaluatePollResponse', () => ({
  evaluatePollResponse: vi.fn(),
}));

vi.mock('./handleCorrectPollResponse', () => ({
  handleCorrectPollResponse: vi.fn(),
}));

vi.mock('./handleWrongPollResponse', () => ({
  handleWrongPollResponse: vi.fn(),
}));

vi.mock('../calculateXP', () => ({
  calculateBetXP: vi.fn(),
}));

vi.mock('../calculateDevvotedScore', () => ({
  calculateDevvotedScore: vi.fn(),
}));

vi.mock('../upsertScoresToPollUserPerformance', () => ({
  upsertScoresToPollUserPerformance: vi.fn(),
}));

vi.mock('../multipliers', () => ({
  getStreakMultiplierIncreaseForBet: vi.fn(),
}));

describe('createPostPollResponse', () => {
  const mockSupabase = {} as any;
  const mockUserId = 'test-user-id';
  const mockSelectedBet = 50;
  
  // Mock values for user performance
  const previousXP = 100;
  const previousMultiplier = 0.5;
  const previousStreak = 2;
  const previousDevvotedScore = 1.5;
  const previousBettingAverage = '50.0';
  
  // Mock values for calculated results
  const mockMultiplierIncrease = 0.5;
  const mockNewMultiplier = 1.0;
  const mockXPGain = 75;
  const mockNewDevvotedScore = 2.0;
  const mockNewBettingAverage = '60.0';

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    (getStreakMultiplierIncreaseForBet as any).mockReturnValue(mockMultiplierIncrease);
    
    (calculateBetXP as any).mockReturnValue({
      totalXP: mockXPGain,
      multiplierBonus: 25,
      betXP: 50,
    });
    
    (calculateDevvotedScore as any).mockResolvedValue(mockNewDevvotedScore);
    (upsertScoresToPollUserPerformance as any).mockResolvedValue({});
    
    // Mock getUserPerformance to return previous stats
    vi.spyOn(global, 'fetch').mockImplementation((url: string) => {
      if (url.includes('user-performance')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            temporary_xp: previousXP,
            streak_multiplier: previousMultiplier,
            current_streak: previousStreak,
            devvoted_score: previousDevvotedScore,
            betting_average: previousBettingAverage,
          }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response);
    });
  });

  describe('Single choice polls', () => {
    const mockSingleChoicePoll: Poll = {
      id: 1,
      question: 'Test Question',
      status: 'open',
      answer_type: 'single',
      category_code: 'test',
      opening_time: new Date(),
      closing_time: new Date(),
    } as Poll;

    it('should handle fully correct answers for single choice polls', async () => {
      // Mock evaluation result for a correct single choice answer
      (evaluatePollResponse as any).mockResolvedValue({
        hasIncorrectOption: false,
        hasAllCorrectOptionsSelected: true,
        isSingleChoice: true,
        correctnessScore: 1,
      });
      
      const result = await createPostPollResponse({
        supabase: mockSupabase,
        poll: mockSingleChoicePoll,
        userId: mockUserId,
        selectedOptions: ['1'],
        selectedBet: mockSelectedBet,
      });
      
      // Verify the result
      expect(result.isCorrect).toBe(true);
      expect(result.isPartiallyCorrect).toBeFalsy();
      expect(result.changes.xpGain).toBe(mockXPGain);
      expect(result.changes.newMultiplier).toBe(mockNewMultiplier);
      expect(result.changes.newStreak).toBe(previousStreak + 1);
      
      // Verify that correct poll response handling was called
      expect(handleCorrectPollResponse).toHaveBeenCalled();
      expect(handleWrongPollResponse).not.toHaveBeenCalled();
    });

    it('should handle incorrect answers for single choice polls', async () => {
      // Mock evaluation result for an incorrect single choice answer
      (evaluatePollResponse as any).mockResolvedValue({
        hasIncorrectOption: true,
        hasAllCorrectOptionsSelected: false,
        isSingleChoice: true,
        correctnessScore: 0,
      });
      
      // Mock wrong poll response handling
      (handleWrongPollResponse as any).mockResolvedValue(1.0); // Decreased score
      
      const result = await createPostPollResponse({
        supabase: mockSupabase,
        poll: mockSingleChoicePoll,
        userId: mockUserId,
        selectedOptions: ['2'],
        selectedBet: mockSelectedBet,
      });
      
      // Verify the result
      expect(result.isCorrect).toBe(false);
      expect(result.isPartiallyCorrect).toBeFalsy();
      expect(result.changes.newStreak).toBe(0); // Streak reset
      
      // Verify that wrong poll response handling was called
      expect(handleCorrectPollResponse).not.toHaveBeenCalled();
      expect(handleWrongPollResponse).toHaveBeenCalled();
    });
  });

  describe('Multiple choice polls', () => {
    const mockMultipleChoicePoll: Poll = {
      id: 2,
      question: 'Test Multiple Choice Question',
      status: 'open',
      answer_type: 'multiple',
      category_code: 'test',
      opening_time: new Date(),
      closing_time: new Date(),
    } as Poll;

    it('should handle fully correct answers for multiple choice polls', async () => {
      // Mock evaluation result for a fully correct multiple choice answer
      (evaluatePollResponse as any).mockResolvedValue({
        hasIncorrectOption: false,
        hasAllCorrectOptionsSelected: true,
        isSingleChoice: false,
        correctnessScore: 1,
      });
      
      const result = await createPostPollResponse({
        supabase: mockSupabase,
        poll: mockMultipleChoicePoll,
        userId: mockUserId,
        selectedOptions: ['1', '2'],
        selectedBet: mockSelectedBet,
      });
      
      // Verify the result
      expect(result.isCorrect).toBe(true);
      expect(result.isPartiallyCorrect).toBeFalsy();
      expect(result.changes.xpGain).toBe(mockXPGain);
      expect(result.changes.newMultiplier).toBe(mockNewMultiplier);
      expect(result.changes.newStreak).toBe(previousStreak + 1);
      
      // Verify that correct poll response handling was called
      expect(handleCorrectPollResponse).toHaveBeenCalled();
      expect(handleWrongPollResponse).not.toHaveBeenCalled();
    });

    it('should handle partially correct answers for multiple choice polls', async () => {
      // Mock evaluation result for a partially correct multiple choice answer
      (evaluatePollResponse as any).mockResolvedValue({
        hasIncorrectOption: false,
        hasAllCorrectOptionsSelected: false,
        isSingleChoice: false,
        correctnessScore: 0.5, // Half correct
      });
      
      // Mock XP calculation with partial credit
      (calculateBetXP as any).mockReturnValue({
        totalXP: mockXPGain / 2, // Half XP for half correct
        multiplierBonus: 12.5,
        betXP: 25,
      });
      
      const result = await createPostPollResponse({
        supabase: mockSupabase,
        poll: mockMultipleChoicePoll,
        userId: mockUserId,
        selectedOptions: ['1'], // Only one of the correct options
        selectedBet: mockSelectedBet,
      });
      
      // Verify the result
      expect(result.isCorrect).toBe(false);
      expect(result.isPartiallyCorrect).toBe(true);
      expect(result.changes.xpGain).toBe(mockXPGain / 2); // Half XP
      expect(result.changes.newMultiplier).toBe(mockNewMultiplier);
      expect(result.changes.newStreak).toBe(previousStreak + 1); // Still increases streak
      
      // Verify that correct poll response handling was called (with partial credit)
      expect(handleCorrectPollResponse).toHaveBeenCalled();
      expect(handleWrongPollResponse).not.toHaveBeenCalled();
    });

    it('should handle partially correct answers with incorrect selections', async () => {
      // Mock evaluation result for a partially correct answer with incorrect selections
      (evaluatePollResponse as any).mockResolvedValue({
        hasIncorrectOption: true,
        hasAllCorrectOptionsSelected: false,
        isSingleChoice: false,
        correctnessScore: 0.25, // Some correct with penalty
      });
      
      // Mock XP calculation with partial credit
      (calculateBetXP as any).mockReturnValue({
        totalXP: mockXPGain / 4, // Quarter XP for quarter correct
        multiplierBonus: 6.25,
        betXP: 12.5,
      });
      
      const result = await createPostPollResponse({
        supabase: mockSupabase,
        poll: mockMultipleChoicePoll,
        userId: mockUserId,
        selectedOptions: ['1', '3'], // One correct, one incorrect
        selectedBet: mockSelectedBet,
      });
      
      // Verify the result
      expect(result.isCorrect).toBe(false);
      expect(result.isPartiallyCorrect).toBe(true);
      expect(result.changes.xpGain).toBe(mockXPGain / 4); // Quarter XP
      expect(result.changes.newStreak).toBe(previousStreak + 1); // Still increases streak
      
      // Verify that correct poll response handling was called (with partial credit)
      expect(handleCorrectPollResponse).toHaveBeenCalled();
      expect(handleWrongPollResponse).not.toHaveBeenCalled();
    });

    it('should handle completely incorrect answers for multiple choice polls', async () => {
      // Mock evaluation result for a completely incorrect multiple choice answer
      (evaluatePollResponse as any).mockResolvedValue({
        hasIncorrectOption: true,
        hasAllCorrectOptionsSelected: false,
        isSingleChoice: false,
        correctnessScore: 0, // No correct answers
      });
      
      // Mock wrong poll response handling
      (handleWrongPollResponse as any).mockResolvedValue(1.0); // Decreased score
      
      const result = await createPostPollResponse({
        supabase: mockSupabase,
        poll: mockMultipleChoicePoll,
        userId: mockUserId,
        selectedOptions: ['3', '4'], // All incorrect options
        selectedBet: mockSelectedBet,
      });
      
      // Verify the result
      expect(result.isCorrect).toBe(false);
      expect(result.isPartiallyCorrect).toBeFalsy();
      expect(result.changes.newStreak).toBe(0); // Streak reset
      
      // Verify that wrong poll response handling was called
      expect(handleCorrectPollResponse).not.toHaveBeenCalled();
      expect(handleWrongPollResponse).toHaveBeenCalled();
    });
  });
});
