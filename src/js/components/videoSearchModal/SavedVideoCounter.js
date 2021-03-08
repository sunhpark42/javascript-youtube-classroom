import Component from '../../core/Component.js';
import { store } from '../../index.js';
import { $, localStorageGetItem } from '../../utils/utils.js';
import { LOCALSTORAGE_KEYS } from '../../constants/constants.js';

export default class VideoSearchResult extends Component {
  setup() {
    store.subscribe(this.render.bind(this));
  }

  initRender() {
    this.$target.innerHTML = `
        <div class="d-flex justify-end text-gray-700">
          저장된 영상 갯수 : <span id="saved-video-counter--number">${
            Object.keys(localStorageGetItem(LOCALSTORAGE_KEYS.VIDEOS)).length
          }</span>/100 개
        </div>
    `;
  }

  selectDOM() {
    this.$savedVideoCountNumber = $('#saved-video-counter--number');
  }

  render(preStates, states) {
    if (preStates.savedVideoCount !== states.savedVideoCount) {
      this.$savedVideoCountNumber.textContent = states.savedVideoCount;
    }
  }
}
