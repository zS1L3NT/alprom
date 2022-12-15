# Alprom

![License](https://img.shields.io/github/license/zS1L3NT/alprom?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/alprom?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/alprom?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/alprom?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/alprom?style=for-the-badge)

Alprom is a clone of Wordle that [@jyorien](https://github.com/jyorien), [@zS1L3NT](https://github.com/zS1L3NT), [@TechSupportz](https://github.com/TechSupportz) and [@PuttTim](https://github.com/PuttTim) built together as a submission for the [iNTUition v8](https://intuition-v8.devpost.com/) Hackathon.

After that, me, @TechSupportz and @PuttTim decided to use it as one of our school deliverable for a module called Innovation and Entrepreneurship (Innova). I did a complete rebuild of the frontend and backend to get the game working and ready for the product demonstration.

## Motivation

We all love playing Wordle but we find it hard to coordinate competitive Wordle games. We built Alprom so we can compete with each other.

## Subrepositories

### [`web-express-alprom`](web-express-alprom)

The Express backend for users to play in the same lobby

### [`web-react-alprom`](https://github.com/TechSupportz/alprom-react)

The React frontend for users to play the game

## Features

-   Custom usernames
-   Lobby system
    -   Create a lobby
    -   Join a lobby
-   Wordle game
    -   Text Validation
    -   Letter colors

## Built with

-   Express
    -   TypeScript
        -   [![@types/cors](https://img.shields.io/badge/%40types%2Fcors-%5E2.8.12-red?style=flat-square)](https://npmjs.com/package/@types/cors/v/2.8.12)
        -   [![@types/crypto-js](https://img.shields.io/badge/%40types%2Fcrypto--js-%5E4.1.1-red?style=flat-square)](https://npmjs.com/package/@types/crypto-js/v/4.1.1)
        -   [![@types/express](https://img.shields.io/badge/%40types%2Fexpress-%5E4.17.13-red?style=flat-square)](https://npmjs.com/package/@types/express/v/4.17.13)
        -   [![@types/node](https://img.shields.io/badge/%40types%2Fnode-%5E18.0.3-red?style=flat-square)](https://npmjs.com/package/@types/node/v/18.0.3)
        -   [![typescript](https://img.shields.io/badge/typescript-%5E4.7.4-red?style=flat-square)](https://npmjs.com/package/typescript/v/4.7.4)
    -   Miscellaneous
        -   [![colors](https://img.shields.io/badge/colors-%5E1.4.0-red?style=flat-square)](https://npmjs.com/package/colors/v/1.4.0)
        -   [![cors](https://img.shields.io/badge/cors-%5E2.8.5-red?style=flat-square)](https://npmjs.com/package/cors/v/2.8.5)
        -   [![dotenv](https://img.shields.io/badge/dotenv-%5E16.0.1-red?style=flat-square)](https://npmjs.com/package/dotenv/v/16.0.1)
        -   [![express](https://img.shields.io/badge/express-%5E4.18.1-red?style=flat-square)](https://npmjs.com/package/express/v/4.18.1)
        -   [![firebase-admin](https://img.shields.io/badge/firebase--admin-%5E11.0.0-red?style=flat-square)](https://npmjs.com/package/firebase-admin/v/11.0.0)
        -   [![no-try](https://img.shields.io/badge/no--try-%5E3.1.0-red?style=flat-square)](https://npmjs.com/package/no-try/v/3.1.0)
        -   [![simple-crypto-js](https://img.shields.io/badge/simple--crypto--js-%5E3.0.1-red?style=flat-square)](https://npmjs.com/package/simple-crypto-js/v/3.0.1)
        -   [![tracer](https://img.shields.io/badge/tracer-%5E1.1.6-red?style=flat-square)](https://npmjs.com/package/tracer/v/1.1.6)
        -   [![validate-any](https://img.shields.io/badge/validate--any-%5E1.3.2-red?style=flat-square)](https://npmjs.com/package/validate-any/v/1.3.2)
-   React
    -   TypeScript
        -   [![@types/luxon](https://img.shields.io/badge/%40types%2Fluxon-%5E3.0.0-red?style=flat-square)](https://npmjs.com/package/@types/luxon/v/3.0.0)
        -   [![@types/react](https://img.shields.io/badge/%40types%2Freact-%5E18.0.15-red?style=flat-square)](https://npmjs.com/package/@types/react/v/18.0.15)
        -   [![@types/react-dom](https://img.shields.io/badge/%40types%2Freact--dom-%5E18.0.6-red?style=flat-square)](https://npmjs.com/package/@types/react-dom/v/18.0.6)
        -   [![typescript](https://img.shields.io/badge/typescript-%5E4.7.4-red?style=flat-square)](https://npmjs.com/package/typescript/v/4.7.4)
    -   React
        -   [![react](https://img.shields.io/badge/react-%5E18.2.0-red?style=flat-square)](https://npmjs.com/package/react/v/18.2.0)
        -   [![react-dom](https://img.shields.io/badge/react--dom-%5E18.2.0-red?style=flat-square)](https://npmjs.com/package/react-dom/v/18.2.0)
        -   [![react-icons](https://img.shields.io/badge/react--icons-%5E4.4.0-red?style=flat-square)](https://npmjs.com/package/react-icons/v/4.4.0)
        -   [![react-router-dom](https://img.shields.io/badge/react--router--dom-%5E6.3.0-red?style=flat-square)](https://npmjs.com/package/react-router-dom/v/6.3.0)
    -   Vite
        -   [![@vitejs/plugin-react](https://img.shields.io/badge/%40vitejs%2Fplugin--react-%5E2.0.0-red?style=flat-square)](https://npmjs.com/package/@vitejs/plugin-react/v/2.0.0)
        -   [![vite](https://img.shields.io/badge/vite-%5E3.0.2-red?style=flat-square)](https://npmjs.com/package/vite/v/3.0.2)
    -   Chakra UI
        -   [![@chakra-ui/react](https://img.shields.io/badge/%40chakra--ui%2Freact-%5E2.2.4-red?style=flat-square)](https://npmjs.com/package/@chakra-ui/react/v/2.2.4)
        -   [![@emotion/react](https://img.shields.io/badge/%40emotion%2Freact-%5E11.9.3-red?style=flat-square)](https://npmjs.com/package/@emotion/react/v/11.9.3)
        -   [![@emotion/styled](https://img.shields.io/badge/%40emotion%2Fstyled-%5E11.9.3-red?style=flat-square)](https://npmjs.com/package/@emotion/styled/v/11.9.3)
        -   [![framer-motion](https://img.shields.io/badge/framer--motion-%5E6.5.1-red?style=flat-square)](https://npmjs.com/package/framer-motion/v/6.5.1)
    -   Miscellaneous
        -   [![axios](https://img.shields.io/badge/axios-%5E0.27.2-red?style=flat-square)](https://npmjs.com/package/axios/v/0.27.2)
        -   [![firebase](https://img.shields.io/badge/firebase-%5E9.9.0-red?style=flat-square)](https://npmjs.com/package/firebase/v/9.9.0)
        -   [![gh-pages](https://img.shields.io/badge/gh--pages-%5E4.0.0-red?style=flat-square)](https://npmjs.com/package/gh-pages/v/4.0.0)
        -   [![luxon](https://img.shields.io/badge/luxon-%5E3.0.1-red?style=flat-square)](https://npmjs.com/package/luxon/v/3.0.1)
