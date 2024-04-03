# Practera-cutie

[GitHub Page](https://intersective.github.io/cutie/)
*TODO: No unit test, sonar test yet for cuite-app*

## Requirements

- Ionic 4
- Angular 7

## Installation

- Run `npm install` to install necessary packages
- Duplicate `environment.local.ts` under the `src/environments/` folder and rename it to `environment.ts`
- Run `npm run start` to start a development server on your local, and calling sandbox.practera.com for API

## Development

1. To this project locally start with `demo:true` (in environment.ts)
1. Go to `https://localhost:4202/auth/demo` (the SSL must not be omitted) to get authorised locally
1. Ignore the `.localsegment` error during compilation (it's for devops purpose)
1. Start coding!

## Demo

To run the demo version of CUTIE on local

1. Go to `src/environments/environments.ts`, change `demo: false` to `demo: true`
1. Run `npm run start` to start a local server on `localhost:4202`

## Capacitor

We use Capacitor to make the app work on Android, IOS & Electron

### Android
 - install [JAVA 8 JDK](https://www.oracle.com/technetwork/java/javaee/downloads/jdk8-downloads-2133151.html)
 - install [Android Studio](https://developer.android.com/studio/index.html)
 - run `npx cap open android` to open the project

### IOS
 - Xcode 9 or above version is needed
 - install the Xcode Command Line tools (either from Xcode, or running `xcode-select --install`)
 - run `sudo gem install cocoapods` to install cocoapods
 - run `pod repo update` to update Cocoapods
 - run `npx cap open ios` to open the project in Xcode

### Electron
 - run `npm run electron:start` to launch the Electron instance

After code changes, in order to test the code on Android/IOS/Electron, run `npm run build`.

If there are dependency changes, run `npx cap sync`
