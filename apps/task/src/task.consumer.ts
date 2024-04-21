import { Logger } from '@nestjs/common';
import { Processor, Process, OnQueueActive, OnQueueError } from '@nestjs/bull';
import { Job } from 'bull';
import { JenkinsService } from './jenkins.service';

@Processor('task')
export class TaskConsumer {
  constructor(private jenkinsService: JenkinsService) {}

  private logger = new Logger(TaskConsumer.name);

  @Process('jenkins')
  async handleJenkinsTask(
    job: Job<{
      repo?: string;
      name?: string;
      branch?: string;
    }>,
  ) {
    const { repo, name, branch } = job.data || {};
    if (!repo || !name || !branch) {
      throw new Error('Job of type jenkins executed with wrong data');
    }
    let repositoryUrl = repo;
    const match = repo.match(/^git@github.com:(.+?)\/(.+?)\.git$/);
    if (match) {
      repositoryUrl = `https://github.com/${match[1]}/${match[2]}.git`;
    }
    await this.jenkinsService.ensureJob(name, repositoryUrl);
    await this.jenkinsService.build(name, {
      BRANCH: branch,
    });
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `[Processing] Job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueError()
  onError(job: Job) {
    this.logger.error(
      `[Error] Job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
