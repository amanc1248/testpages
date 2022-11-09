class HelloWorldComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<h1>Hello world it i sis isadfjasjdfjkasdfjkjsajf!</h1>`;
  }
}

customElements.define("hello-world", HelloWorldComponent);
