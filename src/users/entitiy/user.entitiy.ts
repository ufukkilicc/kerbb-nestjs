import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Group } from 'src/group/entities/group.entity';
import { Role } from 'src/role/entities/role.entitiy';
import { Audit } from 'tools/entities/audit.entitiy';
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
  @Prop({ type: mongoose.Schema.Types.String })
  user_reset_password_token: string;
  @Prop({ type: mongoose.Schema.Types.String })
  user_reset_password_expire: Date;
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

  getResetPasswordTokenFromUser(): string {
    const randomHexString = crypto.randomBytes(15).toString('hex');
    const resetPasswordToken = crypto
      .createHash('SHA256')
      .update(randomHexString)
      .digest('hex');
    return resetPasswordToken;
  }

  // @Prop() audit: Audit;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.getResetPasswordTokenFromUser = function () {
  const { RESET_PASSWORD_EXPIRE } = process.env;
  const randomHexString = crypto.randomBytes(15).toString('hex');
  const resetPasswordToken = crypto
    .createHash('SHA256')
    .update(randomHexString)
    .digest('hex');
  this.user_reset_password_token = resetPasswordToken;
  this.user_reset_password_expire =
    Date.now() + parseInt(RESET_PASSWORD_EXPIRE);
  return resetPasswordToken;
};

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
  next();
});
