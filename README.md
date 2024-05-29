# ECHO - UI
A Trading Tlatform UI.

### Prerequisites:

Before you can use this repo, you must have the following software installed:

- [Node.js](https://nodejs.org/) v20.10+
- [Yarn](https://yarnpkg.com/) v1.22+
- [Lerna](https://lerna.js.org/) v8.1+
 
### Installing:

To use/run this repo, follow these steps:

1. Clone this  repo
2. Navigate into the cloned repo directory
3. Install dependencies: `yarn`
4. Install Lerna globally `yarn global add lerna`

For each dependencies in the `./packages` directory, you may need to use the `nohoist` setting so they are local to that directory.
See: https://lerna.js.org/docs/legacy-package-management#replacing-your-usage-of-lerna-add for alternate solution using `workspaces`???
You can define `nohoist` for yarn workspaces. See: https://classic.yarnpkg.com/blog/2018/02/15/nohoist/
More on defining `nohoist`. See: https://stackoverflow.com/a/59701469
You may need to add `nohoist` to the `package.json` IN the sub packages. e.g. `./packages/ei-app/package.json`

### Usage:

##### Component Library:

To start the `components` library Storybook, run:
```shell
yarn storybook
```
This will start a Storybook server at `http://localhost:6006`.

To build the `components` library Storybook, run:
```shell
yarn build:storybook
```
This will create a production build in the `components` library Storybook in the `packages/components/storybook-static` directory.

##### EI Web App:

To start the `ei-app` web app development server, run:
```shell
yarn dev:ei
```
This will start a development server at `http://localhost:3000`.

To lint the `ei-app` web app , run:
```shell
yarn lint:ei
```
This will run the linter on the `packages/ei-app` directory.

To build the `ei-app` web app , run:
```shell
yarn build:ei
```
This will create a production build in the `packages/ei-app/build` directory.

To start the production `ei-app` web app, run:
```shell
yarn start:ei
```
This will start a production server at `http://localhost:3000`.

##### SVT Web App:

To start the `svt-app` web app development server, run:
```shell
yarn start:svt
```
This will start a development server at `http://localhost:3000`.

To build the `svt-app` web app , run:
```shell
yarn build:svt
```
This will create a production build in the `packages/svt-app/build` directory.


##### TDA Web App:

To start the `tda-app` web app development server, run:
```shell
yarn start:tda
```
