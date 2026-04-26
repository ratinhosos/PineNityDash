import mongoose from 'mongoose';

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    mongoose.set('strictQuery', false);
    cached.promise = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Lazy schemas (idempotent registration)
function model(name, schema) {
  return mongoose.models[name] || mongoose.model(name, schema);
}

const { Schema } = mongoose;

export const GuildConfig = model('GuildConfig', new Schema({ guildId: { type: String, unique: true }, staffRoleId: String, verifiedRoleId: String, unverifiedRoleId: String, channels: { logs: String, deletedLogs: String, welcome: String, leave: String } }, { timestamps: true, strict: false }));
export const CommandConfig = model('CommandConfig', new Schema({ guildId: String, commandName: String, category: String, enabled: { type: Boolean, default: true }, channelId: String, embed: { type: Object, default: {} }, buttons: { type: Array, default: [] }, autoMessages: [String], meta: Object }, { timestamps: true, strict: false }));
export const Giveaway = model('Giveaway', new Schema({}, { timestamps: true, strict: false }));
export const Ticket = model('Ticket', new Schema({}, { timestamps: true, strict: false }));
export const TicketPanel = model('TicketPanel', new Schema({}, { timestamps: true, strict: false }));
export const TicketReview = model('TicketReview', new Schema({}, { timestamps: true, strict: false }));
export const Vote = model('Vote', new Schema({}, { timestamps: true, strict: false }));
export const VoteConfig = model('VoteConfig', new Schema({}, { timestamps: true, strict: false }));
export const RGBRole = model('RGBRole', new Schema({}, { timestamps: true, strict: false }));
export const ColorPanel = model('ColorPanel', new Schema({}, { timestamps: true, strict: false }));
export const MemberStats = model('MemberStats', new Schema({}, { timestamps: true, strict: false }));
export const StaffStats = model('StaffStats', new Schema({}, { timestamps: true, strict: false }));
export const Automations = model('Automations', new Schema({}, { timestamps: true, strict: false }));
export const Logs = model('Logs', new Schema({}, { timestamps: true, strict: false }));
export const DeletedMessages = model('DeletedMessages', new Schema({}, { timestamps: true, strict: false }));
export const AntiLinkConfig = model('AntiLinkConfig', new Schema({}, { timestamps: true, strict: false }));
