import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class WorkContent {
  // 页面组件列表
  @Prop()
  components: Record<string, any>[];
  // 页面属性， 如页面背景图片
  @Prop({ type: Object })
  props: Record<string, any>;
  // 配置信息， 如微信分享配置
  @Prop({ type: Object })
  setting: Record<string, any>;
}

export const WorkContentSchema = SchemaFactory.createForClass(WorkContent);
export type WorkContentDocument = HydratedDocument<WorkContent>;
