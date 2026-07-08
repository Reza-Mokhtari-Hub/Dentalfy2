const fs = require('fs');
let content = fs.readFileSync('src/db/models.ts', 'utf8');

content = content.replace(
  'export interface IAccountRequest extends Document {\n  name: string;\n  email: string;\n  bio: string;\n  password?: string;\n  phoneNumber?: string;\n  status: "pending" | "approved" | "rejected";',
  'export interface IAccountRequest extends Document {\n  name: string;\n  email: string;\n  bio: string;\n  password?: string;\n  phoneNumber?: string;\n  gender?: "male" | "female" | "other" | "";\n  status: "pending" | "approved" | "rejected";'
);

content = content.replace(
  'const AccountRequestSchema = new Schema<IAccountRequest>({\n  name: { type: String, required: true },\n  email: { type: String, required: true, lowercase: true, trim: true },\n  bio: { type: String, default: "" },\n  password: { type: String },\n  phoneNumber: { type: String },\n  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },',
  'const AccountRequestSchema = new Schema<IAccountRequest>({\n  name: { type: String, required: true },\n  email: { type: String, required: true, lowercase: true, trim: true },\n  bio: { type: String, default: "" },\n  password: { type: String },\n  phoneNumber: { type: String },\n  gender: { type: String, default: "" },\n  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },'
);

fs.writeFileSync('src/db/models.ts', content);
console.log('patched');
