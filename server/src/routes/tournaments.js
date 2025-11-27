// Add DELETE endpoint for tournaments
export const deleteTournamentRoute = async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.collection('tournaments').doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
};
