import { Work } from '../work.entity';

export class CreateWorkDto {
  author: string;
  title: string;
  subtitle?: string;
  content: string;
}

export class FindOneDto {
  id: number;
  author: string;
}

export class PublishWorkDto {
  id: number;
  author: string;
  isTemplate: boolean;
}
