# DriverDiary

A simple demonstrative app for car management.

## Features

- Create, update, delete vehicles
- Create, update, delete activities by categories with cost, currency, location and comments
- Filter activities by date and categories
- Save activities to bookmarks
- Analyze charts by cost expenditure and categories usage
- Default currency selection
- Light/dark mode toggle

## Tech Stack

- React Native
- Typescript
- WatermelonDB
- RxJS
- Jest
- React Cosmos

## Demo
![demo_main](https://github.com/denlahodnyi/driver-diary-app/assets/37402865/5758a024-4504-416a-8226-e74646f7ddcd)

## Run Locally

Clone the project

```bash
  git clone https://github.com/denlahodnyi/driver-diary-app.git
```

Go to the project directory

```bash
  cd DriverDiary
```

Install dependencies

```bash
  yarn install
```

Install pods for IOS

```bash
  yarn pod-install
```

Check that all external dependencies are installed

```bash
  npx react-native doctor
```

Start the server and follow instructions in to run app in particular simulator

```bash
  yarn start
```

or run directly in IOS simulator

```bash
  yarn ios
```

or run directly in Android simulator

```bash
  yarn android
```
