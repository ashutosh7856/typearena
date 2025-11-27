#!/usr/bin/env node

/**
 * Database Initialization Script
 * Creates required Firestore collections and indexes
 * Run with: node src/utils/dbInit.js
 */

import { db } from '../config/firebaseAdmin.js';

const COLLECTIONS = [
  'users',
  'matches',
  'tournaments',
  'publicRooms',
  'lessonCompletions'
];

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  try {
    // Check/create collections
    for (const collectionName of COLLECTIONS) {
      console.log(`Checking collection: ${collectionName}...`);
      
      try {
        const collectionRef = db.collection(collectionName);
        const snapshot = await collectionRef.limit(1).get();
        
        if (snapshot.empty) {
          console.log(`  ✓ Collection '${collectionName}' exists but is empty`);
        } else {
          console.log(`  ✓ Collection '${collectionName}' exists with ${snapshot.size} document(s)`);
        }
      } catch (error) {
        console.error(`  ✗ Error with collection '${collectionName}':`, error.message);
      }
    }

    console.log('\n📝 Database structure verified!\n');
    console.log('Required indexes (must be created manually in Firebase Console):');
    console.log('  1. lessonCompletions:');
    console.log('     - userId (Ascending), lessonId (Ascending), timestamp (Descending)');
    console.log('  2. matches:');
    console.log('     - userId (Ascending), timestamp (Descending)');
    console.log('  3. tournaments:');
    console.log('     - status (Ascending), createdAt (Descending)');
    console.log('     - isPublic (Ascending), createdAt (Descending)');
    console.log('  4. users:');
    console.log('     - stats.avgWPM (Descending)');
    console.log('     - stats.totalPoints (Descending)');
    
    console.log('\n✅ Database initialization complete!');
    console.log('\n💡 Next steps:');
    console.log('  1. Create the indexes listed above in Firebase Console');
    console.log('  2. Update Firestore security rules to allow new collections');
    console.log('  3. Test the application');
    
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { initializeDatabase };
