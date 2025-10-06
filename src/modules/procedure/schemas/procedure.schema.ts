import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcedureDocument = Procedure & Document;

@Schema({ timestamps: true })
export class Procedure {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ enum: ['code', 'diagram'], default: 'diagram' })
  type: string;

  @Prop({ default: 'ungrouped' })
  group?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Array, default: [] })
  nodes: any[];
  @Prop({ type: Array, default: [] })
  edges: any[];
}

export const ProcedureSchema = SchemaFactory.createForClass(Procedure);
