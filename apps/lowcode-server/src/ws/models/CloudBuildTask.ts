import { TaskService } from '../../task/task.service';

class CloudBuildTask {
  _repo: string;
  _name: string;
  _version: string;
  _branch: string;
  logger: (msg: string) => void;
  taskService: TaskService;

  constructor(options, { logger, taskService }) {
    this._repo = options.repo; // 仓库地址
    this._name = options.name; // 项目名称
    this._branch = options.branch; // 仓库分支
    this.logger = logger;
    this.taskService = taskService;
  }

  async run() {
    const id = await this.addTask();
    await this.pollingCheckState(id);
  }

  async addTask() {
    try {
      const id = await this.taskService.add('jenkins', {
        repo: this._repo,
        name: this._name,
        branch: this._branch,
      });
      this.logger(`Job ${id} 添加成功`);
      return id;
    } catch (error) {
      throw new Error(`Job 添加失败（${error.message}）`);
    }
  }

  pollingCheckState(id: string) {
    return new Promise((resolve, reject) => {
      const checkState = () => {
        setTimeout(async () => {
          const state = await this.taskService.getState(id);
          if (state === 'completed') {
            this.logger(`Job ${id} 执行完成`);
            resolve(true);
          } else if (state === 'failed') {
            reject(new Error(`Job ${id} 执行失败`));
          } else {
            this.logger(`Job ${id} 执行中`);
            checkState();
          }
        }, 2500);
      };
      checkState();
    });
  }
}

export default CloudBuildTask;
