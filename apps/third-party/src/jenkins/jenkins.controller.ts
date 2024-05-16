import { join } from 'path';

import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as Jenkins from 'jenkins';
import * as ejs from 'ejs';

import { BusinessException } from '@lib/common/exceptions/business.exception';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { MicroServiceType } from '@lib/common/types/micro-service.type';

@Controller()
export class JenkinsController {
  @Inject('JENKINS_CLIENT')
  private readonly jenkins: Jenkins;

  private readonly logger = new Logger(JenkinsController.name);

  ejsRender(file: string, data: Record<string, string>): Promise<string> {
    return new Promise((resolve, reject) => {
      ejs.renderFile(file, data, {}, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  @GrpcMethod('JenkinsService', 'EnsureJob')
  async ensureJob({
    job,
    repositoryUrl,
  }: {
    job: string;
    repositoryUrl: string;
  }) {
    try {
      const exist = await this.jenkins.job.exists(job);
      if (!exist) {
        const res = await this.ejsRender(
          join(__dirname, 'templates/config.xml'),
          {
            repositoryUrl,
          },
        );
        await this.jenkins.job.create(job, res);
      }
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException(
        ERRNO_ENUM.JENKINS_REST_API_CALL_FAILED,
        'Jenkis RestAPI调用失败',
      );
    }
  }

  @GrpcMethod('JenkinsService', 'Build')
  async build({ job, params }: { job: string; params: string }) {
    let parameters;
    try {
      parameters = JSON.parse(params);
    } catch (error) {
      throw new BusinessException('params格式有误');
    }
    try {
      await this.jenkins.job.build({
        name: job,
        parameters,
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException(
        ERRNO_ENUM.JENKINS_REST_API_CALL_FAILED,
        'Jenkis RestAPI调用失败',
      );
    }
  }
}

export type IJenkinsMicroService = MicroServiceType<typeof JenkinsController>;
