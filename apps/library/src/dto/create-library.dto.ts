export class CreateLibraryDto {
  name: string;

  version: string;

  url: string;

  remoteEntry: string;

  scope: string;

  author: string;

  components: Array<{
    name: string;
    path: string;
    settingPath: string;
    detailPath: string;
  }>;
}
