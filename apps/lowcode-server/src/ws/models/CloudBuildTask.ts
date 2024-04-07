import { resolve, join } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';
import { spawn } from 'child_process';
import { Socket } from 'socket.io';
import * as fse from 'fs-extra';
import Git, { SimpleGit } from 'simple-git';
import { Logger } from '@nestjs/common';
import { ThirdPartyService } from '../../third-party/third-party.service';

const OSS_REMOTE_FILE = '.git_remote';

class CloudBuildTask {
  _repo: string;
  _name: string;
  _version: string;
  _branch: string;
  _buildCmd: string;
  _buildDir: string;
  _dir: string;
  _sourceCodeDir: string;
  client: Socket;
  logger: Logger;
  _git: SimpleGit;
  thirdPartyService: ThirdPartyService;
  _firstPublish = false;

  constructor(options, { client, logger, thirdPartyService }) {
    this._repo = options.repo; // 仓库地址
    this._name = options.name; // 项目名称
    this._version = options.version; // 版本号
    this._branch = options.branch; // 仓库分支
    this._buildCmd = options.buildCmd; // 构建命令
    this._dir = resolve(
      homedir(),
      '.zafuru-cli',
      'cloudbuild',
      `${this._name}@${this._version}`,
    ); // 缓存目录
    this._sourceCodeDir = resolve(this._dir, this._name); // 缓存源码目录
    this._buildDir = join(this._sourceCodeDir, options.buildDir || 'dist'); // 构建产物目录
    this.client = client;
    this.logger = logger;
    this.thirdPartyService = thirdPartyService;
  }

  async run() {
    await this.prepare();
    await this.download();
    await this.install();
    await this.build();
    await this.prePublish();
    await this.publish();
    await this.clean();
  }

  async prepare() {
    try {
      this.client.emit('building', '开始执行构建前检查');
      const res = await this.thirdPartyService.read(
        `/${this._name}/${OSS_REMOTE_FILE}`,
      );
      if (res.errno) {
        this._firstPublish = true;
      } else if (res.data !== this._repo) {
        throw new Error('当前项目已存在');
      }
      fse.ensureDirSync(this._dir);
      fse.emptyDirSync(this._dir);
      this._git = Git(this._dir);
      this.client.emit('building', '构建前检查成功');
    } catch (error) {
      this.logger.error(
        `任务${this.client.id}构建前检查失败，失败原因：${
          error?.message || error
        }`,
      );
      throw new Error(`构建前检查失败，失败原因：${error.message}`);
    }
  }

  async download() {
    try {
      this.client.emit('building', '开始下载源码');
      await this._git.clone(this._repo);
      this._git = Git(this._sourceCodeDir);
      await this._git.checkout(['-b', this._branch, `origin/${this._branch}`]);
      this.client.emit('building', `源码下载成功(origin/${this._branch})`);
    } catch (error) {
      this.logger.error(
        `任务${this.client.id}源码下载失败，失败原因：${
          error?.message || error
        }`,
      );
      throw new Error('源码下载失败');
    }
  }

  async install() {
    try {
      this.client.emit('building', '开始安装依赖');
      await this.execCommand(
        'npm install --registry=https://registry.npmmirror.com/',
      );
      this.client.emit('building', '依赖安装成功');
    } catch (error) {
      this.logger.error(
        `任务${this.client.id}依赖安装失败，失败原因：${
          error?.message || error
        }`,
      );
      throw new Error('依赖安装失败');
    }
  }

  async build() {
    try {
      this.client.emit('building', '开始执行构建命令');
      if (this._buildCmd && this._buildCmd.startsWith('npm run build')) {
        await this.execCommand(this._buildCmd);
      } else {
        await this.execCommand('npm run build');
      }
      this.client.emit('building', '构建命令执行成功');
    } catch (error) {
      this.logger.error(
        `任务${this.client.id}构建命令执行失败，失败原因：${
          error?.message || error
        }`,
      );
      throw new Error('构建命令执行失败');
    }
  }

  async prePublish() {
    try {
      this.client.emit('building', '开始进行发布前检查');
      if (!existsSync(this._buildDir)) {
        throw new Error('构建产物目录不存在');
      }
      this.client.emit('building', '发布前检查成功');
    } catch (error) {
      this.logger.error(
        `任务${this.client.id}发布前检查失败，失败原因：${
          error?.message || error
        }`,
      );
      throw new Error('发布前检查失败');
    }
  }

  async publish() {
    try {
      this.client.emit('building', '开始进行发布');
      const res = await this.thirdPartyService.publish(
        this._buildDir,
        `${this._name}/${this._version}`,
      );
      if (res.errno) {
        throw new Error('构建产物发布失败');
      }
      if (this._firstPublish) {
        const res2 = await this.thirdPartyService.upload(
          Buffer.from(this._repo),
          `${this._name}/${OSS_REMOTE_FILE}`,
        );
        if (res2.errno) {
          throw new Error('远程仓库地址信息发布失败');
        }
      }
      this.client.emit('building', '发布成功');
    } catch (error) {
      this.logger.error(
        `任务${this.client.id}发布失败，失败原因：${error?.message || error}`,
      );
      throw new Error('发布失败');
    }
  }

  clean() {
    try {
      this.client.emit('building', '开始进行发布后清理');
      if (existsSync(this._dir)) {
        this.logger.log('do clean', this._dir);
        fse.removeSync(this._dir);
      }
      this.client.emit('building', '发布后清理成功');
    } catch (error) {
      this.logger.error(
        `任务${this.client.id}发布后清理失败，失败原因：${
          error?.message || error
        }`,
      );
      throw new Error('发布后清理失败');
    }
  }

  execCommand(command: string) {
    const commands = command.split(/\s+/);
    return new Promise((resolve, reject) => {
      const cp = spawn(commands[0], commands.slice(1) || [], {
        cwd: this._sourceCodeDir,
      });
      cp.on('error', (e) => {
        this.logger.error(`'${command}'命令执行失败`);
        reject(e);
      });
      cp.on('exit', (c) => {
        if (!c) {
          resolve(true);
        } else {
          this.logger.error(`'${command}'命令执行失败`);
          reject(c);
        }
      });
    });
  }
}

export default CloudBuildTask;
