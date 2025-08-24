class MLCSoundboard {
    constructor() {
        this.MAIN_URL = 'https://mountainlaircamp.blob.core.windows.net/mlc-soundbank/';
        this.JSON_NAME = 'MLCSoundBank.json';
        this.sounds = [];
        this.currentlyPlaying = null;
        this.audioCache = new Map();
        
        this.init();
    }

    init() {
        this.loadSoundsFromCache();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const syncBtn = document.getElementById('sync-btn');
        syncBtn.addEventListener('click', () => this.sync());
    }

    async loadSoundsFromCache() {
        try {
            const cachedData = localStorage.getItem('soundMap');
            if (cachedData) {
                const sounds = JSON.parse(cachedData);
                this.sounds = sounds.sort((a, b) => a.SortOrder - b.SortOrder);
                this.renderSounds();
            } else {
                // First time - sync automatically
                await this.sync();
            }
        } catch (error) {
            console.error('Error loading cached sounds:', error);
            this.showError('Error loading sounds from cache');
        }
    }

    async sync() {
        try {
            this.showLoading(true);
            this.hideError();
            
            // Fetch the sound manifest
            const response = await fetch(this.MAIN_URL + this.JSON_NAME);
            if (!response.ok) {
                throw new Error('Failed to fetch sound manifest');
            }
            
            const soundData = await response.json();
            
            // Store in localStorage
            localStorage.setItem('soundMap', JSON.stringify(soundData));
            
            // Update sounds and render
            this.sounds = soundData.sort((a, b) => a.SortOrder - b.SortOrder);
            
            // Preload sounds
            await this.preloadSounds();
            
            this.renderSounds();
            this.showLoading(false);
            
        } catch (error) {
            console.error('Sync error:', error);
            this.showError('Error syncing with server');
            this.showLoading(false);
        }
    }

    async preloadSounds() {
        const totalSounds = this.sounds.length;
        let loadedSounds = 0;
        
        const loadPromises = this.sounds.map(async (sound) => {
            try {
                const audio = new Audio();
                audio.preload = 'none'; // Don't preload audio data yet
                audio.src = `${this.MAIN_URL}${sound.Path}`;
                
                // Store in cache
                this.audioCache.set(sound.Path, audio);
                
                loadedSounds++;
                this.updateProgress(loadedSounds, totalSounds);
                
            } catch (error) {
                console.error(`Error preloading ${sound.Name}:`, error);
            }
        });
        
        await Promise.all(loadPromises);
    }

    renderSounds() {
        const soundsList = document.getElementById('sounds-list');
        soundsList.innerHTML = '';
        
        this.sounds.forEach((sound, index) => {
            const soundItem = this.createSoundItem(sound, index);
            soundsList.appendChild(soundItem);
        });
    }

    createSoundItem(sound, index) {
        const div = document.createElement('div');
        div.className = 'sound-item';
        div.dataset.index = index;
        
        div.innerHTML = `
            <div class="sound-info">
                <div class="sound-name">${sound.Name}</div>
                <div class="sound-tags">by ${sound.Tags[0]}</div>
            </div>
            <button class="play-btn" data-path="${sound.Path}">
                <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="pause-icon" style="display: none;" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                </svg>
            </button>
        `;
        
        const playBtn = div.querySelector('.play-btn');
        playBtn.addEventListener('click', () => this.toggleSound(sound, div));
        
        return div;
    }

    async toggleSound(sound, soundElement) {
        const playBtn = soundElement.querySelector('.play-btn');
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        
        // If this sound is currently playing, stop it
        if (this.currentlyPlaying && this.currentlyPlaying.element === soundElement) {
            this.stopCurrentSound();
            return;
        }
        
        // Stop any currently playing sound
        if (this.currentlyPlaying) {
            this.stopCurrentSound();
        }
        
        try {
            // Get or create audio element
            let audio = this.audioCache.get(sound.Path);
            if (!audio) {
                audio = new Audio(`${this.MAIN_URL}${sound.Path}`);
                this.audioCache.set(sound.Path, audio);
            }
            
            // Update UI
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            soundElement.classList.add('playing');
            
            // Play the sound
            audio.currentTime = 0;
            await audio.play();
            
            // Track currently playing
            this.currentlyPlaying = {
                audio: audio,
                element: soundElement,
                sound: sound
            };
            
            // Handle when sound ends
            audio.onended = () => {
                this.stopCurrentSound();
            };
            
        } catch (error) {
            console.error('Error playing sound:', error);
            this.showError('Error playing audio');
            
            // Reset UI on error
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            soundElement.classList.remove('playing');
        }
    }

    stopCurrentSound() {
        if (!this.currentlyPlaying) return;
        
        const { audio, element } = this.currentlyPlaying;
        
        // Stop audio
        audio.pause();
        audio.currentTime = 0;
        
        // Update UI
        const playBtn = element.querySelector('.play-btn');
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        element.classList.remove('playing');
        
        this.currentlyPlaying = null;
    }

    showLoading(show) {
        const loadingContainer = document.getElementById('loading-container');
        loadingContainer.style.display = show ? 'block' : 'none';
    }

    updateProgress(current, total) {
        const progressElement = document.getElementById('sync-progress');
        progressElement.textContent = `Loading sounds: ${current} of ${total}`;
    }

    showError(message) {
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = message;
        errorContainer.style.display = 'block';
    }

    hideError() {
        const errorContainer = document.getElementById('error-container');
        errorContainer.style.display = 'none';
    }
}

// Initialize the soundboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MLCSoundboard();
});