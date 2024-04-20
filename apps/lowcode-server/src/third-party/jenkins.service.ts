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
    return await firstValueFrom(
      this.jenkinsService.ensureJob({ job, repositoryUrl }),
    );
  }
}
