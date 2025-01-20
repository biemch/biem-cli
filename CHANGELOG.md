## 1.3.0 (2025-01-20)

### Feature

- enhance environment variable validation ([d001f52](https://github.com/biemch/biem-cli/commit/d001f52876c39fb35bdd185f113f2d4e3cea0a21))

### Bug Fix

- update preset import statements to remove file extensions ([b96fcc9](https://github.com/biemch/biem-cli/commit/b96fcc9266d44edcd3ba87a6f2ed3874b822f620))
- rename template create context to template deploy context ([6c00143](https://github.com/biemch/biem-cli/commit/6c00143c4f682e753a7553468a3ba66b8cf863ba))
- reorganize service initialization in template-deploy service ([0cd6e9d](https://github.com/biemch/biem-cli/commit/0cd6e9db014662bb01315a746f7d55de9a3cb4d4))
- add missing template directory parameter ([7319ddd](https://github.com/biemch/biem-cli/commit/7319ddd418c00f283ef9713be662ae3a29a09920))

### Refactor

- improve template create command ([9daa689](https://github.com/biemch/biem-cli/commit/9daa689a6dbfbdcdf1ffd160a9b1fd5b8f5169b6))
- update template images ([976efee](https://github.com/biemch/biem-cli/commit/976efee2bad75cadf8d904c1fb9eb1f4babd1c38))
- improve error handling in config validation ([477e64d](https://github.com/biemch/biem-cli/commit/477e64dee8f98fcd6c550a51eef723d8dd25989b))
- rename and reorganize API services for improved structure ([cc7baef](https://github.com/biemch/biem-cli/commit/cc7baef0941d9424be4c8628428cb5047f3740d0))

## 1.2.2 (2025-01-18)

### Feature

- enhance changelog generation by using commitizen ([feacc12](https://github.com/biemch/biem-cli/commit/feacc122afad9af660057944463839b809aebe1f))
- update changelog generation command to use commitizen ([b24b4cc](https://github.com/biemch/biem-cli/commit/b24b4cc9c4c8053e10268d6abdbc05c97258701e))

## 1.2.1 (2025-01-17)

### Feature

- add code checkout step in release workflow and include CHANGELOG.md in package files ([562de41](https://github.com/biemch/biem-cli/commit/562de41220ef3a8853a1537877abfaacbf5f184a))

## 1.2.0 (2025-01-17)

### Feature

- add release automation script and update commitizen configuration ([f84856e](https://github.com/biemch/biem-cli/commit/f84856ee13dcc8a64235a4e7baf04db6f16aec4f))
- mask sensitive data in api error handling ([9c95973](https://github.com/biemch/biem-cli/commit/9c959734571f11e00039e64ddc012a25b31f72d2))
- add object util ([f59bbaa](https://github.com/biemch/biem-cli/commit/f59bbaaa920906177769a00107e667fd68a7d099))
- enable collapsing of subtasks in renderer options ([fc929c4](https://github.com/biemch/biem-cli/commit/fc929c423c0cd979724079ddb3a35ccefd979635))
- implement template deploy command ([7fdb578](https://github.com/biemch/biem-cli/commit/7fdb578eba82379319002eaeb30ba32021e21fa7))

### Bug Fix

- rename unused parameter ctx in authentication task ([6d8a762](https://github.com/biemch/biem-cli/commit/6d8a7624eaf908bf886229287116e63cb9cab551))
- do not parse/validate config twice ([f889f66](https://github.com/biemch/biem-cli/commit/f889f66073b64b77de28ee56688a3b8e0ddb9c8e))
- enforce semantic versioning format for version field in config schema ([9ee1115](https://github.com/biemch/biem-cli/commit/9ee11151b3733c8e4ca52596422a25b559dcf36b))
- remove generic type from authentication and deployment tasks ([89179a0](https://github.com/biemch/biem-cli/commit/89179a0a88b3e604dce089e81f9b6698e8f72b95))
- reduce default delay in task execution and update method signature ([6fcad91](https://github.com/biemch/biem-cli/commit/6fcad91e90926137dcd6dc41a02fa3657294fa41))
- URL typo in organization service ([adce26f](https://github.com/biemch/biem-cli/commit/adce26f83b9144f1c1a6dffa115f2e812ceee845))
- adapt get template directory to new folder structure ([1e7af29](https://github.com/biemch/biem-cli/commit/1e7af2994c584e039002730d7e49954edd1d18ba))

### Refactor

- improve error handling ([23684e1](https://github.com/biemch/biem-cli/commit/23684e1ad76c506d04f9439d1e097cfc096d28a4))
- improve service initialization and restructure validation, authentication, and deployment tasks ([da89c43](https://github.com/biemch/biem-cli/commit/da89c43862480ffd375acdf0c21aa69330af9432))
- move api related services to api subfolder ([49e1117](https://github.com/biemch/biem-cli/commit/49e11177440a56d6d65255009ae308ba31988ed7))

## 1.1.3 (2024-12-30)

### Bug Fix

- add repository, homepage, and bugs fields to package.json ([b969441](https://github.com/biemch/biem-cli/commit/b9694414c5d4f70e669e5020d3abd4411e314d7b))

## 1.1.2 (2024-12-30)

### Bug Fix

- fix dependencies in package.json ([d1949da](https://github.com/biemch/biem-cli/commit/d1949dad0f72d7a93b328427f24259049f70a93d))

## 1.1.1 (2024-12-30)

### Bug Fix

- add publishConfig for public access in package.json ([ed745b0](https://github.com/biemch/biem-cli/commit/ed745b07025947b182d60b334c72f966db32134d))
