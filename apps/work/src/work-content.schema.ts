import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class WorkContent {
  /**
   * key: nodeId
   * value: node
   */
  @Prop({ type: Object })
  nodes: Record<string, any>;

  /**
   * nodesState
   * jsModuleCode
   */
  @Prop({ type: Object })
  store: Record<string, any>;
}

export const WorkContentSchema = SchemaFactory.createForClass(WorkContent);
export type WorkContentDocument = HydratedDocument<WorkContent>;
