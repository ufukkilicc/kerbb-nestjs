import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Group } from 'src/group/entities/group.entity';
import { Role } from 'src/role/entities/role.entitiy';
import { Audit } from 'tools/entities/audit.entitiy';
const bcrypt = require('bcrypt');

@Schema()
export class User extends Document {
  @Prop({
    type: mongoose.Schema.Types.Number,
    required: false,
    default: 1,
  })
  tracking_id: number;
  @Prop({ type: mongoose.Schema.Types.String }) user_name: string;
  @Prop({ type: mongoose.Schema.Types.String }) user_surname: string;
  @Prop({ type: mongoose.Schema.Types.String }) user_email: string;
  @Prop({ type: mongoose.Schema.Types.String }) user_password: string;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Role',
    default: [],
  })
  user_roles: Role[];
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Group',
    default: [],
  })
  user_groups: Group[];
  // @Prop() audit: Audit;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  var doc = this;
  const docCount = await doc.collection.countDocuments();
  doc.tracking_id = docCount + 1;
  if (!this.isModified('user_password')) {
    next();
  }
  const hashText = process.env.HASH_TEXT;
  const saltRounds = 10;
  this.user_password = await bcrypt.hash(
    `${hashText}${this.user_password}`,
    saltRounds,
  );
});
