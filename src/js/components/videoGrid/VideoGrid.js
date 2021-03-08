import Component from '../../core/Component.js';
import { $, $$, createElement } from '../../utils/utils.js';

export default class VideoGrid extends Component {
  skeletonTemplate() {
    const fragment = document.createDocumentFragment();
    const skeleton = createElement({ tag: 'div', classes: ['skeleton'] });
    const img = createElement({ tag: 'div', classes: ['image'] });
    const line = createElement({ tag: 'p', classes: ['line'] });

    skeleton.appendChild(img.cloneNode(true));
    skeleton.appendChild(line.cloneNode(true));
    skeleton.appendChild(line.cloneNode(true));

    Array.from({ length: 10 }).forEach(() => {
      fragment.appendChild(skeleton.cloneNode(true));
    });

    return fragment;
  }

  removeSkeletons() {
    const $skeltons = $$('.skeleton', this.$target);

    $skeltons.forEach((skeleton) => {
      skeleton.remove();
    });
  }

  displayClips() {
    const $clips = $$('.clip', this.$target);

    $clips.forEach((clip) => {
      if (!clip.classList.contains('d-none')) return;
      clip.classList.remove('d-none');
    });
  }

  async waitUntilAllVideoLoaded() {
    return await new Promise((resolve) => {
      const interval = setInterval(() => {
        const $iframes = $$('iframe', this.$target);
        const isAllIframeLoaded = Array.from($iframes).every((preview) =>
          preview.classList.contains('loaded')
        );
        if (!isAllIframeLoaded) return;
        this.removeSkeletons();
        this.displayClips();
        clearInterval(interval);
        resolve();
      }, 10);
    });
  }
}
