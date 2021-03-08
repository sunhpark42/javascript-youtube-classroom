import VideoSearchBar from './VideoSearchBar.js';
import SearchTermHistory from './SearchTermHistory.js';
import SavedVideoCounter from './SavedVideoCounter.js';
import Component from '../../core/Component.js';
import { $ } from '../../utils/utils.js';
import { youtubeAPIManager } from '../App.js';
import { store } from '../../index.js';
import {
  addSearchHistory,
  updateRequestPending,
  updateVideosToBeShown,
} from '../../redux/action.js';
import SearchVideoGrid from './SearchVIdeoGrid.js';

export default class VideoSearchModal extends Component {
  constructor($target) {
    super($target);
    this.mount();
  }

  initRender() {
    this.$target.innerHTML = `
    <div class="video-search-overlay w-100"></div>
    <div class="modal-inner p-8">
        <button class="modal-close">
          <svg viewbox="0 0 40 40">
            <path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" />
          </svg>
        </button>
        <header>
          <h2 class="text-center">🔎 유튜브 검색</h2>
        </header>
        <section id="video-search-bar">
        </section>
        <section id="search-term-history" class="mt-2">
        </section>
        <section id="saved-video-counter">
        </section>
        <section id="searched-video-wrapper" class="video-wrapper">
        </section>
      </div>
    </div>`;
  }

  mount() {
    this.videoSearchBar = new VideoSearchBar($('#video-search-bar'), {
      requestVideos: this.requestVideos.bind(this),
    });

    this.searchTermHistory = new SearchTermHistory($('#search-term-history'), {
      requestVideos: this.requestVideos.bind(this),
    });

    this.savedVideoCounter = new SavedVideoCounter($('#saved-video-counter'));

    this.searchVideoGrid = new SearchVideoGrid($('#searched-video-wrapper'), {
      requestVideos: this.requestVideos.bind(this),
    });
  }

  selectDOM() {
    this.$modalClose = $('.modal-close');
    this.$overlay = $('.video-search-overlay');
  }

  bindEvent() {
    this.$modalClose.addEventListener('click', this.onModalClose.bind(this));
    this.$target.addEventListener(
      'mousedown',
      this.onClickOutsideModal.bind(this)
    );
  }

  onClickOutsideModal(event) {
    if (event.target === this.$overlay) {
      this.onModalClose();
    }
  }

  onModalShow() {
    this.$target.classList.add('open');
    this.videoSearchBar.$videoSearchInput.focus();
    document.body.style.overflowY = 'hidden';
  }

  onModalClose() {
    this.$target.classList.remove('open');
    document.body.style.overflowY = 'visible';
  }

  async requestVideos(searchTerm) {
    try {
      if (searchTerm) {
        store.dispatch(addSearchHistory(searchTerm));
        youtubeAPIManager.setSearchTerm(searchTerm);
      }
      store.dispatch(updateRequestPending(true));
      const videoInfos = await youtubeAPIManager.requestVideos();
      store.dispatch(updateRequestPending(false));
      store.dispatch(updateVideosToBeShown(videoInfos));
    } catch (error) {
      this.searchVideoGrid.removeSkeletons();
      store.dispatch(updateRequestPending(false));
      alert(error);
    }
  }
}
