import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IJenkinsMicroService } from 'apps/third-party/src/jenkins/jenkins.controller';

@Injectable()
export class JenkinsService implements OnModuleInit {
  private jenkinsService: IJenkinsMicroService;

  constructor(
    @Inject('JENKINS_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.jenkinsService =
      this.client.getService<IJenkinsMicroService>('JenkinsService');
  }

  async ensureJob(job: string, repositoryUrl: string) {
    const res = await firstValueFrom(
      this.jenkinsService.ensureJob({ job, repositoryUrl }),
    );
    if (res.errno) {
      throw new Error(res.message);
    }
    return res.data;
  }

  async build(job: string, data: Record<string, any>) {
    let params;
    try {
      params = JSON.stringify(data);
    } catch (error) {
      throw new Error('params序列化失败');
    }
    const res = await firstValueFrom(
      this.jenkinsService.build({ job, params }),
    );
    if (res.errno) {
      throw new Error(res.message);
    }
    return res.data;
  }
}
