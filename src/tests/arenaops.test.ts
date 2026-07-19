/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db, initialMatches, initialZones } from '../mockDb.ts';
import { Match, Zone } from '../types.ts';

/**
 * ARENAOPS PLATFORM: ENTERPRISE TEST SUITE
 * Simulated integration tests verifying critical business rule boundaries
 */
export function runArenaOpsTests() {
  console.log('====================================================');
  console.log('       ARENAOPS INTEGRITY TEST SUITE RUNNING        ');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  };

  try {
    // Test 1: Rest Day Fatigue rule validation
    console.log('\n--- Test 1: Team Rest Fatigue Validation ---');
    const invalidRestMatch: Partial<Match> = {
      homeTeam: 'Red Wings',
      awayTeam: 'Blue Eagles',
      datetime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 90,
      restDaysHome: 1, // Only 1 day rest, should fail validation
      restDaysAway: 5
    };

    const validation1 = db.validateMatchSchedule(invalidRestMatch);
    assert(
      validation1.valid === false && validation1.errors.some(e => e.includes('Rest Day Warning')),
      'Should reject scheduling if home team rest fatigue is under 3 days.'
    );

    // Test 2: Double-Booking Overlapping schedule check
    console.log('\n--- Test 2: Venue Double-Booking Conflict ---');
    const existingMatch = db.getMatches()[0];
    const overlappingMatch: Partial<Match> = {
      homeTeam: 'Cavalier United',
      awayTeam: 'Saber FC',
      datetime: existingMatch.datetime, // Exact overlap
      durationMinutes: 90,
      restDaysHome: 5,
      restDaysAway: 5
    };

    const validation2 = db.validateMatchSchedule(overlappingMatch);
    assert(
      validation2.valid === false && validation2.errors.some(e => e.includes('Time conflict')),
      'Should reject booking if venue has overlapping match windows within buffers.'
    );

    // Test 3: Sensor Tick Flow Progression
    console.log('\n--- Test 3: IoT Sensor Data Progression ---');
    const stateBefore = { ...db.getState() };
    db.progressSimulation();
    const stateAfter = db.getState();

    assert(
      stateBefore.zones.length === stateAfter.zones.length,
      'Sensor tick progression should maintain exact zone layout topology.'
    );
    console.log(`Current Power Consumption: ${stateAfter.utility.powerUsageKw} kW`);

    // Test 4: Eco-Savings Mode utility adjustments
    console.log('\n--- Test 4: Eco-Savings Mode Engagement ---');
    db.setSavingMode(true);
    const ecoState = db.getState();
    assert(
      ecoState.utility.savingModeActive === true && ecoState.utility.gridStatus === 'saving_mode',
      'Should successfully toggle Eco Savings Mode in Utility grids.'
    );

    // Disengage Eco mode for future tests
    db.setSavingMode(false);

    // Test 5: AI Scheduler Optimization Calendar shift
    console.log('\n--- Test 5: AI Tournament Calendar Optimizer ---');
    const beforeCount = db.getMatches().length;
    const optimization = db.optimizeMatches();
    const afterCount = db.getMatches().length;

    assert(
      beforeCount === afterCount && typeof optimization.changesApplied === 'number',
      'AI optimization routine should successfully analyze and optimize calendar slots without altering match inventory counts.'
    );

    console.log('\n====================================================');
    console.log(`TEST SUITE RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================\n');
  } catch (error) {
    console.error('Error conducting integrity tests', error);
  }
}

// Auto run test logs inside the build output console
runArenaOpsTests();
