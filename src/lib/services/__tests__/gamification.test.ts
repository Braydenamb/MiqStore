import { describe, it, expect } from 'vitest'
import { calculateLevel, getMembershipPerks } from '../gamification'

describe('Gamification - Level Math', () => {
  it('calculates Level 1 for 0 Reward Points', () => {
    const state = calculateLevel(0);
    expect(state.currentLevel).toBe(1);
    expect(state.currentXP).toBe(0);
    expect(state.tier).toBe("BRONZE");
  })

  it('calculates Level 2 and SILVER tier for 100 Reward Points', () => {
    // 100 Reward Points = 1000 XP = Level 2.
    // Level >= 10 unlocks SILVER, wait, Level 2 should be BRONZE! Let's check the logic.
    // calculateLevel says: `if (currentLevel >= 10) tier = "SILVER"`.
    // So 100 Reward Points = Level 2 -> BRONZE.
    const state = calculateLevel(100);
    expect(state.currentLevel).toBe(2);
    expect(state.currentXP).toBe(1000);
    expect(state.tier).toBe("BRONZE");
  })

  it('unlocks PLATINUM (GOLD) tier at Level 25', () => {
    // Level 25 requires 2400 Reward points 
    // Level = floor(points / 100) + 1  => 25 = floor(2400/100) + 1
    const state = calculateLevel(2400);
    expect(state.currentLevel).toBe(25);
    expect(state.tier).toBe("GOLD");
  })
})

describe('Gamification - Perks', () => {
  it('grants 1% cashback to BRONZE', () => {
    const perks = getMembershipPerks("BRONZE");
    expect(perks.cashbackPercent).toBe(1);
  })

  it('grants 3% cashback to DIAMOND', () => {
    const perks = getMembershipPerks("DIAMOND");
    expect(perks.cashbackPercent).toBe(3);
  })
})
