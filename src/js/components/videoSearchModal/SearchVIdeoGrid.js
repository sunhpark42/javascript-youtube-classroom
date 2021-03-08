import { store } from '../../index.js';
import VideoGrid from '../videoGrid/VideoGrid.js';

export default class SearchVideoGrid extends VideoGrid {
  setup() {
    store.subscribe(this.render.bind(this));
  }

  bindEvent() {
    this.$target.addEventListener('scroll', this.scrollEvent.bind(this));
  }

  scrollEvent(e) {
    const $videoWrapper = e.target;
    if (
      $videoWrapper.scrollHeight - $videoWrapper.scrollTop ===
      $videoWrapper.clientHeight
    ) {
      this.$props.requestVideos();
    }
  }

  render(preStates, states) {
    if (preStates.searchHistory !== states.searchHistory) {
      this.$target.innerHTML = '';
    }

    if (
      preStates.requestPending !== states.requestPending &&
      states.requestPending
    ) {
      this.$target.appendChild(this.skeletonTemplate());
    }

    if (preStates.searchedVideos !== states.searchedVideos) {
      if (states.searchedVideos.length === 0) {
        this.$searchedVideoWrapper.innerHTML = `<img class="w-100" src="./src/images/status/not_found.png" alt="not found"/>`;
        return;
      }
      const fragment = document.createDocumentFragment();
      states.searchedVideos.forEach((video) => {
        fragment.appendChild(video.createTemplate('search'));
      });
      this.$target.appendChild(fragment);
      this.waitUntilAllVideoLoaded();
    }
  }
}
