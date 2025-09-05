const twilio = require('twilio');
const client = require('../config/twilio');
const Appointment = require('../models/Appointment');
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const VoiceGrant = AccessToken.VoiceGrant;

exports.getVideoToken = async (req, res) => {
  try {
    const { room } = req.body;
    const identity = req.user.id; // user’s id as identity

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY_SID,
      process.env.TWILIO_API_SECRET
    );

    token.identity = identity;
    token.addGrant(new VideoGrant({ room }));

    res.json({ token: token.toJwt(), room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVoiceToken = async (req, res) => {
  try {
    const identity = req.user.id;

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY_SID,
      process.env.TWILIO_API_SECRET
    );

    token.identity = identity;
    token.addGrant(new VoiceGrant({ outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID }));

    res.json({ token: token.toJwt() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Generate Twilio Video Room for appointment
exports.createVideoRoom = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name phone')
      .populate('doctor', 'name phone');
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Create or reuse Twilio Video Room
    const room = await client.video.v1.rooms.create({
      uniqueName: `appointment_${appointment._id}`,
      type: 'go'   // "go" plan is free tier
    });

    res.json({ message: "Video room created", roomUrl: `https://video.twilio.com/rooms/${room.uniqueName}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Optional: Voice Call (phone-to-phone using Twilio)
exports.initiateVoiceCall = async (req, res) => {
  try {
    const { to } = req.body; // phone number to call
    const call = await client.calls.create({
      twiml: '<Response><Say>Hello, this is your Nabha Telemedicine call.</Say></Response>',
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    res.json({ message: "Call initiated", sid: call.sid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
