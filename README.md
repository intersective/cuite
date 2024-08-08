# Practera-cutie

[GitHub Page](https://intersective.github.io/cutie/)
*TODO: No unit test, sonar test yet for cuite-app*

## Requirements

- Ionic 7
- Angular 15
- stable Node version (20 or above) that comatible with Angular 15 and ionic 7.

## Installation

- Clone the repository and navigate to the folder.
- Run `npm install` to install necessary packages
- Duplicate `environment.local.ts` under the `src/environments/` folder and rename it to `environment.ts`
- Download the `cutie-environment.ts` file [Link](https://drive.google.com/drive/folders/1qggIJIib_S36ohZB1DJ9m50dGUxQ5Pzx?usp=sharing).
- Update your `environment.ts` file values with `cutie-environment.ts` file values.
- Run `npm run start` to start a development server on your local, and calling stage.practera.com for API

## Demo

To run the demo version of CUTIE on local

1. Go to `src/environments/environments.ts`, change `demo: false` to `demo: true`
2. Run `npm run start` to start a local server on `localhost:4202`
3. This will not make any API calls and use demo data.

## Development

1. To run this project locally, start with `demo:true` (in environment.ts)
1. Go to `https://localhost:4202/auth/demo` (the SSL must not be omitted) to get authorised locally
1. Ignore the `.localsegment` error during compilation (it's for devops purpose)
1. Start coding!

### Sandbox/Stage API environment (option 1)

1. Copy the "me" object from the localStorage from our app or core-admin
1. Paste it in your running local cutie-app's localStorage with the same key ("me")
1. There is no content in the root "/"
1. relative-url must be added after the `https://localhost:4202/` in order to see the content that you expect to see
1. For example, `https://localhost:4202/overview-only` will redirect you to *overview-only* route. 
1. You would not redirected and will get stuck in `https://localhost:4202` when there is no relative URL appended.

### Sandbox/Stage API environment (option 2)

1. Follow this URL format: https://localhost:4202/?redirect=overview-only&jwt={OUR-APP-APIKEY}
1. Get the APIKEY from the already authorised app user localStorage or HTTP header and replace {OUR-APP-APIKEY} with the obtained APIKEY
1. You'll be redirect to the specified "redirect" destination.

### Redirect options

- **/chat-only** - for admin chat components.
- **/overview-only** - for admin home components.
- **/templates** - for template libarary.
- **/metrics** - for metrics components.

disable for now

- **/onboarding** - user onboarding MVP.
- **/progress-only**.

## Capacitor

We have Capacitor configaration setup to make the app work on Android, IOS & Electron. **But Cutie app is not develoing for mobile**
