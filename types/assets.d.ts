declare module '*.scss?local' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.less?local' {
  const content: { [className: string]: string };
  export default content;
}
