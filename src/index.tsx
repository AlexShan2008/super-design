// const ENV = process.env.NODE_ENV;
// if (
//   ENV !== 'production' &&
//   ENV !== 'test' &&
//   typeof console !== 'undefined' &&
//   console.warn && // eslint-disable-line no-console
//   typeof window !== 'undefined'
// ) {
//   // eslint-disable-next-line no-console
//   console.warn(
//     'You are using a whole package of antd, ' +
//       'please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.',
//   );
// }

export { default as Avatar } from "./components/avatar";
export { default as Badge } from "./components/badge";
export { default as Button } from "./components/button";
export { default as Highlight } from "./components/highlight";
export { default as Radio } from "./components/radio";
export { default as Icon } from "./components/icon";
export { default as Message } from "./components/message";
// export { default as Modal } from "./components/modal";
export { default as Progress } from "./components/progress";
// export { default as Carousel } from "./components/carousel";
export { default as GlobalStyle } from "./components/shared/global";
export * from "./components/shared/styles";
export * from "./components/shared/animation";