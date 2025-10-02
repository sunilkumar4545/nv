
class VGVideoGalleryManager {
    constructor() {
        this.galleryGrid = document.getElementById('vgGalleryGrid');
        this.modalBackdrop = document.getElementById('vgYoutubeModal');
        this.youtubeFrame = document.getElementById('vgYoutubeFrame');
        this.closeModalBtn = document.getElementById('vgCloseModal');

        this.videoData = [
            {
                id: '1',
                type: 'video',
                src: 'assets/videos/vid 1.mp4',
                title: 'Invitation Reveal ✉️',
                aspectRatio: 'vertical'
            },
            {
                id: '2',
                type: 'video',
                src: 'assets/videos/vid7.mp4',
                title: 'Pre-Wedding Shoot',
                aspectRatio: 'vertical'
            },

            {
                id: '4',
                type: 'video',
                src: 'assets/videos/vid3.mp4',
                title: 'Makeup BTS',
                aspectRatio: 'square'
            },
            {
                id: '5',
                type: 'video',
                src: 'assets/videos/vid4.mp4',
                title: 'BTS',
                aspectRatio: 'square'
            },
            {
                id: '6',
                type: 'video',
                src: 'assets/videos/vid5.mp4',
                title: 'Couple Photo Shoot',
                aspectRatio: 'vertical'
            },
            {
                id: '7',
                type: 'video',
                src: 'assets/videos/vid6.mp4',
                title: 'Couple BTS',
                aspectRatio: 'square'
            },
            {
                id: '8',
                type: 'youtube',
                youtubeId: 'T61jzfXq4qI',
                title: 'Wedding Highlights',
                aspectRatio: 'wide'
            },

        ];

        this.init();
    }

    init() {
        this.renderVideos();
        this.setupEventListeners();
    }

    renderVideos() {
        this.galleryGrid.innerHTML = '';

        this.videoData.forEach(video => {
            const videoElement = this.createVideoElement(video);
            this.galleryGrid.appendChild(videoElement);
        });
    }

    createVideoElement(video) {
        const mediaCard = document.createElement('div');
        mediaCard.className = `vg-media-card vg-aspect-${video.aspectRatio}`;
        mediaCard.dataset.vgVideoId = video.id;

        if (video.type === 'youtube') {
            mediaCard.innerHTML = `
                <div class="vg-content-wrapper">
                    <img src="https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg" 
                         alt="${video.title}" 
                         class="vg-video-thumbnail"
                         onerror="this.src='https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg'"
                         style="width:100%;height:100%;object-fit:cover;">
                    <div class="vg-yt-badge">YouTube</div>
                    <div class="vg-hover-overlay">
                        <button class="vg-primary-btn">
                            <svg viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="vg-media-label">${video.title}</div>
                </div>
            `;

            mediaCard.addEventListener('click', () => this.openYouTubeModal(video));
        } else {
            mediaCard.innerHTML = `
                <div class="vg-content-wrapper">
                    <video class="vg-video-player" preload="metadata" muted>
                        <source src="${video.src}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="vg-hover-overlay">
                        <div class="vg-button-group">
                            <button class="vg-action-btn vg-playpause-btn">
                                <svg class="vg-play-svg" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                <svg class="vg-pause-svg" viewBox="0 0 24 24" style="display: none;">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                </svg>
                            </button>
                            <button class="vg-action-btn vg-volume-btn">
                                <svg class="vg-volume-on-svg" viewBox="0 0 24 24">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                </svg>
                                <svg class="vg-volume-off-svg" viewBox="0 0 24 24" style="display: none;">
                                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="vg-media-label">${video.title}</div>
                </div>
            `;

            const videoEl = mediaCard.querySelector('.vg-video-player');
            const playPauseBtn = mediaCard.querySelector('.vg-playpause-btn');
            const volumeBtn = mediaCard.querySelector('.vg-volume-btn');
            const playSvg = playPauseBtn.querySelector('.vg-play-svg');
            const pauseSvg = playPauseBtn.querySelector('.vg-pause-svg');
            const volumeOnSvg = volumeBtn.querySelector('.vg-volume-on-svg');
            const volumeOffSvg = volumeBtn.querySelector('.vg-volume-off-svg');

            // Handle video loading
            videoEl.addEventListener('loadeddata', () => {
                mediaCard.classList.remove('vg-loading-state');
            });

            // Play/Pause functionality
            playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleVideo(videoEl, playSvg, pauseSvg);
            });

            // Volume/Mute functionality
            volumeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMute(videoEl, volumeOnSvg, volumeOffSvg);
            });

            // Video ended event
            videoEl.addEventListener('ended', () => {
                playSvg.style.display = 'block';
                pauseSvg.style.display = 'none';
            });
        }

        return mediaCard;
    }

    toggleVideo(videoEl, playSvg, pauseSvg) {
        if (videoEl.paused) {
            // Pause all other videos
            document.querySelectorAll('.vg-video-player').forEach(v => {
                if (v !== videoEl && !v.paused) {
                    v.pause();
                    // Update their icons
                    const item = v.closest('.vg-media-card');
                    const playIconOther = item.querySelector('.vg-play-svg');
                    const pauseIconOther = item.querySelector('.vg-pause-svg');
                    playIconOther.style.display = 'block';
                    pauseIconOther.style.display = 'none';
                }
            });

            // Play this video
            videoEl.play();
            playSvg.style.display = 'none';
            pauseSvg.style.display = 'block';
        } else {
            videoEl.pause();
            playSvg.style.display = 'block';
            pauseSvg.style.display = 'none';
        }
    }

    toggleMute(videoEl, volumeOnSvg, volumeOffSvg) {
        videoEl.muted = !videoEl.muted;

        if (videoEl.muted) {
            volumeOnSvg.style.display = 'none';
            volumeOffSvg.style.display = 'block';
        } else {
            volumeOnSvg.style.display = 'block';
            volumeOffSvg.style.display = 'none';
        }
    }

    openYouTubeModal(video) {
        const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&enablejsapi=1`;
        this.youtubeFrame.src = embedUrl;
        this.modalBackdrop.classList.add('vg-modal-active');
        document.body.style.overflow = 'hidden';

        // Handle potential iframe loading errors
        this.youtubeFrame.onerror = () => {
            console.warn('YouTube video failed to load');
            // Optionally redirect to YouTube directly
            window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank');
            this.closeYouTubeModal();
        };
    }

    closeYouTubeModal() {
        this.modalBackdrop.classList.remove('vg-modal-active');
        this.youtubeFrame.src = '';
        document.body.style.overflow = 'auto';
    }

    setupEventListeners() {
        // Close modal events
        this.closeModalBtn.addEventListener('click', () => this.closeYouTubeModal());

        this.modalBackdrop.addEventListener('click', (e) => {
            if (e.target === this.modalBackdrop) {
                this.closeYouTubeModal();
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalBackdrop.classList.contains('vg-modal-active')) {
                this.closeYouTubeModal();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            // Pause all videos on resize to prevent layout issues
            document.querySelectorAll('.vg-video-player').forEach(video => {
                if (!video.paused) {
                    video.pause();
                    const item = video.closest('.vg-media-card');
                    const playSvg = item.querySelector('.vg-play-svg');
                    const pauseSvg = item.querySelector('.vg-pause-svg');
                    playSvg.style.display = 'block';
                    pauseSvg.style.display = 'none';
                }
            });
        });

        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const videoEl = entry.target.querySelector('.vg-video-player');
                        if (videoEl && !videoEl.dataset.vgLoaded) {
                            videoEl.load();
                            videoEl.dataset.vgLoaded = 'true';
                        }
                    }
                });
            }, { threshold: 0.1 });

            // Observe all video items
            document.querySelectorAll('.vg-media-card').forEach(item => {
                videoObserver.observe(item);
            });
        }
    }
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VGVideoGalleryManager();
});
