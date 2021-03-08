import { LOCALSTORAGE_KEYS } from '../../constants/constants.js';
import { store } from '../../index.js';
import {
  $,
  $$,
  localStorageSetItem,
  createElement,
  localStorageGetItem,
} from '../../utils/utils.js';
import Video from '../../model/Video.js';
import VideoGrid from '../videoGrid/VideoGrid.js';

export default class VideoManagerView extends VideoGrid {
  setup() {
    this.watchedFilter = false;
    store.subscribe(this.render.bind(this));
    this.pageIndex = 0;
  }

  initRender() {
    this.renderSavedVideo();
    const snackBar = createElement({ tag: 'div' });
    const notSavedVideoMessage = createElement({
      tag: 'h2',
      textContent: '저장된 비디오가 없습니다.',
    });
    snackBar.id = 'snackbar';
    notSavedVideoMessage.id = 'nothing-videos';
    notSavedVideoMessage.classList.add('d-none');
    this.$target.appendChild(notSavedVideoMessage);
    this.$target.appendChild(snackBar);
  }

  selectDOM() {
    this.$snackbar = $('#snackbar');
    this.$notSavedVideoMessage = $('#nothing-videos');
  }

  getSavedVideos() {
    return localStorageGetItem(LOCALSTORAGE_KEYS.VIDEOS);
  }

  renderSavedVideo() {
    const savedVideos = this.getSavedVideos();
    if (Object.keys(savedVideos).length) {
      Object.keys(savedVideos).forEach((videoId) => {
        if (savedVideos[videoId].watched !== this.watchedFilter) {
          return;
        }

        const video = new Video({
          videoId,
          videoTitle: savedVideos[videoId].videoTitle,
          channelTitle: savedVideos[videoId].channelTitle,
          channelId: savedVideos[videoId].channelId,
          publishedAt: savedVideos[videoId].publishedAt,
          thumbnailURL: savedVideos[videoId].thumbnailURL,
          watched: savedVideos[videoId].watched,
        }).createTemplate('management');

        const fragment = document.createDocumentFragment();
        fragment.appendChild(video);
        this.$target.appendChild(fragment);
      });
    } else {
      // TODO: 비디오가 저장되면 메시지 지우기, 비디오가 삭제되고 저장된 비디오가 없으면 메시지 띄우기
      this.clearVideos();
      this.$notSavedVideoMessage.classList.remove('d-none');
    }
  }

  clearVideos() {
    $$('.clip', this.$target).forEach(($chip) => $chip.remove());
  }

  useWatchedFilter(watchedFilter = false) {
    if (this.watchedFilter !== watchedFilter) {
      this.watchedFilter = watchedFilter;
      this.clearVideos();
      this.renderSavedVideo();
    }
  }

  render(preStates, states) {
    if (preStates.savedVideoCount !== states.savedVideoCount) {
      this.clearVideos();
      this.renderSavedVideo();
    }
  }

  onClickWatchedButton(event) {
    const savedVideos = this.getSavedVideos();
    const clip = event.target.closest('.clip');
    savedVideos[clip.dataset.videoId].watched = !savedVideos[
      clip.dataset.videoId
    ].watched;
    localStorageSetItem(LOCALSTORAGE_KEYS.VIDEOS, savedVideos);
    clip.remove();
  }

  onClickDeleteButton(event) {
    const savedVideos = this.getSavedVideos();
    const clip = event.target.closest('.clip');
    if (
      !(
        confirm('정말로 삭제하시겠습니까?') && savedVideos[clip.dataset.videoId]
      )
    ) {
      throw new Error('삭제에 실패했습니다.');
    }
    delete savedVideos[clip.dataset.videoId];
    localStorageSetItem(LOCALSTORAGE_KEYS.VIDEOS, savedVideos);
    clip.remove();
  }

  showSnackBar(text) {
    this.$snackbar.textContent = text;
    this.$snackbar.classList.toggle('show');
    setTimeout(() => {
      this.$snackbar.classList.toggle('show');
    }, 3000);
  }

  // TODO: 좀 더 Object literal로 바꾸기
  bindEvent() {
    this.$target.addEventListener('click', (event) => {
      try {
        if (event.target.classList.contains('watched-button')) {
          this.onClickWatchedButton(event);
          this.showSnackBar('설정이 완료되었습니다.');
        } else if (event.target.classList.contains('delete-button')) {
          this.onClickDeleteButton(event);
          this.showSnackBar('정상적으로 삭제되었습니다.');
        }
      } catch (error) {
        this.showSnackBar(error.message);
      }
    });
  }
}
