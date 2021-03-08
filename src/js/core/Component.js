export default class Component {
  constructor($target, $props) {
    this.$target = $target;
    this.$props = $props;
    this.setup();
    this.initRender();
    this.selectDOM();
    this.bindEvent();
  }

  setup() {
    console.warn('재정의 되지 않은 setup 입니다.');
  }
  initRender() {
    console.warn('재정의 되지 않은 initRender 입니다.');
  }
  render() {
    console.warn('재정의 되지 않은 render 입니다.');
  }
  selectDOM() {
    console.warn('재정의 되지 않은 selectDOM 입니다.');
  }
  bindEvent() {
    console.warn('재정의 되지 않은 bindEvent 입니다.');
  }
}
