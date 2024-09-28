// import mongoose from 'mongoose'
// const Schema = mongoose.Schema;

// const messageSchema = new Schema({
//   sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   type: { type: String, enum: ['DM', 'COMMUNITY'], required: true },
//   community: { type: Schema.Types.ObjectId, ref: 'Community', required: function() { return this.type === 'COMMUNITY'; } }, // Optional, for group messages
//   receiver: { type: Schema.Types.ObjectId, ref: 'User', required: function() { return this.type === 'DM'; }  }, // Optional, for direct messages
//   message: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now }
// });

// const Message = mongoose.model('Message', messageSchema);

// export default  Message

