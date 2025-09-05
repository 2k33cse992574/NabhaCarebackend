exports.sendNotification = async (req, res) => {
  const { userId, message } = req.body;
  // Mock for now
  console.log(`Notification to ${userId}: ${message}`);
  res.json({ success: true, message: `Notification sent to ${userId}` });
};
