/**
 * Background Music Player & Multi-Track Playlist Controller
 */

export class AudioController {
  constructor(playlistConfig) {
    this.playlist = Array.isArray(playlistConfig) ? playlistConfig : [playlistConfig];
    this.currentTrackIndex = 0;
    this.currentTrack = this.playlist[0] || { title: 'Romantic Melody', artist: 'Love Theme', audioUrl: '' };

    this.audio = new Audio(this.currentTrack.audioUrl);
    this.audio.loop = true;
    this.isPlaying = false;

    this.floatingWidget = null;
    this.fallbackBanner = null;

    // Big Player UI elements cache
    this.playerEls = {};

    this.initUI();
    this.initBigPlayerUI();
  }

  initUI() {
    // Create Floating Controller Widget
    this.floatingWidget = document.createElement('div');
    this.floatingWidget.className = 'audio-floating-widget';
    this.floatingWidget.innerHTML = `
      <button class="audio-toggle-btn" id="audio-toggle-btn" aria-label="Toggle Audio">
        <svg class="audio-icon-play" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      </button>
      <div class="audio-info-wrapper">
        <span class="audio-track-title" id="floating-track-title">${this.escapeHtml(this.currentTrack.title)}</span>
        <span class="audio-track-artist" id="floating-track-artist">${this.escapeHtml(this.currentTrack.artist)}</span>
      </div>
    `;
    document.body.appendChild(this.floatingWidget);

    // Create Autoplay Blocked Fallback Top Banner
    this.fallbackBanner = document.createElement('div');
    this.fallbackBanner.className = 'audio-fallback-banner';
    this.fallbackBanner.innerHTML = `
      <span class="audio-fallback-text">🎵 Play romantic background music for your surprise</span>
      <button class="audio-fallback-play-btn" id="audio-fallback-play-btn">
        <span>Play Music</span>
      </button>
    `;
    document.body.appendChild(this.fallbackBanner);

    // Event listeners
    const toggleBtn = document.getElementById('audio-toggle-btn');
    if (toggleBtn) toggleBtn.addEventListener('click', () => this.togglePlay());

    const fallbackBtn = document.getElementById('audio-fallback-play-btn');
    if (fallbackBtn) {
      fallbackBtn.addEventListener('click', () => {
        this.play();
        this.hideFallbackBanner();
      });
    }

    // Audio Event Listeners for Progress Bar
    this.audio.addEventListener('timeupdate', () => this.updateProgressBar());
    this.audio.addEventListener('loadedmetadata', () => {
      this.updateTotalTime();
      this.updateProgressBar();
    });
    this.audio.addEventListener('ended', () => this.nextTrack());
  }

  initBigPlayerUI() {
    this.playerEls = {
      vinyl: document.getElementById('player-vinyl'),
      title: document.getElementById('player-title'),
      artist: document.getElementById('player-artist'),
      timeCurrent: document.getElementById('player-time-current'),
      timeTotal: document.getElementById('player-time-total'),
      progressBar: document.getElementById('player-progress-bar'),
      progressFill: document.getElementById('player-progress-fill'),
      progressThumb: document.getElementById('player-progress-thumb'),
      btnPrev: document.getElementById('player-btn-prev'),
      btnPlay: document.getElementById('player-btn-play'),
      btnNext: document.getElementById('player-btn-next'),
      iconPlay: document.getElementById('player-icon-play'),
      iconPause: document.getElementById('player-icon-pause')
    };

    // Event Listeners for Big Player Controls
    if (this.playerEls.btnPlay) {
      this.playerEls.btnPlay.addEventListener('click', () => this.togglePlay());
    }
    if (this.playerEls.btnPrev) {
      this.playerEls.btnPrev.addEventListener('click', () => this.prevTrack());
    }
    if (this.playerEls.btnNext) {
      this.playerEls.btnNext.addEventListener('click', () => this.nextTrack());
    }
    if (this.playerEls.progressBar) {
      this.playerEls.progressBar.addEventListener('click', (e) => {
        const rect = this.playerEls.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        if (width && this.audio.duration) {
          const percent = clickX / width;
          this.audio.currentTime = percent * this.audio.duration;
        }
      });
    }

    // Initial setup
    if (this.playerEls.title) this.playerEls.title.textContent = this.currentTrack.title;
    if (this.playerEls.artist) this.playerEls.artist.textContent = this.currentTrack.artist;
  }

  showWidget() {
    if (this.floatingWidget) {
      this.floatingWidget.classList.add('is-visible');
    }
  }

  loadTrack(trackIndex) {
    if (trackIndex < 0 || trackIndex >= this.playlist.length) return;
    this.currentTrackIndex = trackIndex;
    this.currentTrack = this.playlist[trackIndex];

    this.audio.pause();
    this.audio.src = this.currentTrack.audioUrl;
    this.audio.load();

    // Update Floating Widget
    const titleEl = document.getElementById('floating-track-title');
    if (titleEl) titleEl.textContent = this.currentTrack.title;
    const artistEl = document.getElementById('floating-track-artist');
    if (artistEl) artistEl.textContent = this.currentTrack.artist;

    // Update Big Player
    if (this.playerEls.title) this.playerEls.title.textContent = this.currentTrack.title;
    if (this.playerEls.artist) this.playerEls.artist.textContent = this.currentTrack.artist;

    // Update Playlist Item UI (in index.html)
    const items = document.querySelectorAll('.playlist-track-item');
    items.forEach(i => i.classList.remove('is-active'));
    const activeItem = document.querySelector(`.playlist-track-item[data-index="${trackIndex}"]`);
    if (activeItem) activeItem.classList.add('is-active');

    this.play();
  }

  nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % this.playlist.length;
    this.loadTrack(nextIdx);
  }

  prevTrack() {
    const prevIdx = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadTrack(prevIdx);
  }

  async play() {
    try {
      await this.audio.play();
      this.isPlaying = true;
      this.updateUI();
      this.hideFallbackBanner();
    } catch (err) {
      console.log('Autoplay prevented by browser:', err);
      this.isPlaying = false;
      this.updateUI();
      this.showFallbackBanner();
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateUI();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  showFallbackBanner() {
    if (this.fallbackBanner) {
      this.fallbackBanner.classList.add('is-shown');
    }
  }

  hideFallbackBanner() {
    if (this.fallbackBanner) {
      this.fallbackBanner.classList.remove('is-shown');
    }
  }

  updateUI() {
    // 1. Update Floating Widget
    const toggleBtn = document.getElementById('audio-toggle-btn');
    if (toggleBtn) {
      if (this.isPlaying) {
        toggleBtn.classList.add('is-playing');
        toggleBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        `;
      } else {
        toggleBtn.classList.remove('is-playing');
        toggleBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        `;
      }
    }

    // 2. Update Big Player UI
    if (this.playerEls.vinyl) {
      if (this.isPlaying) {
        this.playerEls.vinyl.classList.add('is-playing');
      } else {
        this.playerEls.vinyl.classList.remove('is-playing');
      }
    }

    if (this.playerEls.iconPlay && this.playerEls.iconPause) {
      if (this.isPlaying) {
        this.playerEls.iconPlay.style.display = 'none';
        this.playerEls.iconPause.style.display = 'block';
      } else {
        this.playerEls.iconPlay.style.display = 'block';
        this.playerEls.iconPause.style.display = 'none';
      }
    }
  }

  updateProgressBar() {
    if (!this.playerEls.progressFill) return;
    
    const current = this.audio.currentTime || 0;
    const duration = this.audio.duration || 0;
    
    // Update progress bar width
    if (duration > 0) {
      const percent = (current / duration) * 100;
      this.playerEls.progressFill.style.width = `${percent}%`;
      if (this.playerEls.progressThumb) {
        this.playerEls.progressThumb.style.left = `${percent}%`;
      }
    }

    // Update current time text
    if (this.playerEls.timeCurrent) {
      this.playerEls.timeCurrent.textContent = this.formatTime(current);
    }
  }

  updateTotalTime() {
    if (this.playerEls.timeTotal && this.audio.duration) {
      this.playerEls.timeTotal.textContent = this.formatTime(this.audio.duration);
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
