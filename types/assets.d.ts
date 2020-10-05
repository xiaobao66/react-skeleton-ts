declare module '*.scss?local' {
  const content: { [className: string]: string };
  export default content;
}
