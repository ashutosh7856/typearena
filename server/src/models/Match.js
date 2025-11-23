import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  userId: { type: String, required: false }, // For future auth
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  mode: { type: String, enum: ['single', 'multi'], required: true },
  date: { type: Date, default: Date.now }
});

export const Match = mongoose.model('Match', matchSchema);
