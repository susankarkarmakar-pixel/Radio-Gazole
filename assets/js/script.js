// Scheme Data Structure
const schemes = [
    {
        id: "suraksha",
        title: "সামাজিক সুরক্ষা ভাতা",
        description: "বয়স্ক, বিধবা ও বিশেষ চাহিদা সম্পন্ন নাগরিকদের জন্য মাসিক আর্থিক অনুদান।",
        icon: "👵",
        videoId: "v3gwlHi1J6A",
        durationText: "২ মিনিট ১৫ সেকেন্ড",
        shortName: "সুরক্ষা ভাতা"
    },
    {
        id: "annapurna",
        title: "Annapurna Yojana",
        description: "মহিলাদের স্বনির্ভর করতে মাসিক আর্থিক অনুদান প্রকল্প।",
        icon: "💰",
        videoId: null,
        durationText: "--",
        shortName: "Annapurna Yojana"
    },
    {
        id: "pmayg",
        title: "প্রধানমন্ত্রী আবাস যোজনা (গ্রামীণ)",
        description: "গ্রামীণ এলাকার দরিদ্র ও গৃহহীন পরিবারকে পাকা বাড়ি নির্মাণের জন্য আর্থিক সহায়তা।",
        icon: "🏠",
        videoId: null,
        durationText: "--",
        shortName: "আবাস যোজনা"
    },
    {
        id: "kanyashree",
        title: "কন্যাশ্রী প্রকল্প",
        description: "বাল্যবিবাহ রোধ এবং মেয়েদের শিক্ষার প্রসারে আর্থিক অনুদান।",
        icon: "👩",
        videoId: null,
        durationText: "--",
        shortName: "কন্যাশ্রী"
    },
    {
        id: "krishakbandhu",
        title: "কৃষক বন্ধু প্রকল্প",
        description: "কৃষকদের আর্থ-সামাজিক উন্নয়ন ও কৃষি কাজে সহায়তার জন্য অনুদান।",
        icon: "👨‍🌾",
        videoId: null,
        durationText: "--",
        shortName: "কৃষক বন্ধু"
    },
    {
        id: "ayushman",
        title: "Ayushman Card",
        description: "প্রতিটি পরিবারকে বছরে ৫ লক্ষ টাকা পর্যন্ত বিনামূল্যে চিকিৎসার সুবিধা।",
        icon: "❤️",
        videoId: null,
        durationText: "--",
        shortName: "Ayushman Card"
    },
    {
        id: "rupashree",
        title: "রূপশ্রী প্রকল্প",
        description: "দরিদ্র পরিবারের মেয়েদের বিয়ের জন্য এককালীন আর্থিক সহায়তা।",
        icon: "👰",
        videoId: null,
        durationText: "--",
        shortName: "রূপশ্রী"
    }
];

let currentSchemeIndex = 0;
let player;
let isPlaying = false;
let updateInterval;
let isPlayerReady = false;

// Load YouTube Iframe API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    const initialVideoId = schemes[currentSchemeIndex].videoId || 'v3gwlHi1J6A';

    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: initialVideoId,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'rel': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    isPlayerReady = true;
    updateTimeDisplay();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayPauseIcons(true);
        startProgressUpdate();
        document.getElementById('visualizer').classList.add('active');
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        isPlaying = false;
        updatePlayPauseIcons(false);
        stopProgressUpdate();
        document.getElementById('visualizer').classList.remove('active');
    }
}

function initApp() {
    initTheme();

    // Check URL for scheme parameter
    const urlParams = new URLSearchParams(window.location.search);
    const schemeParam = urlParams.get('scheme');
    if (schemeParam) {
        const foundIndex = schemes.findIndex(s => String(s.id) === schemeParam);
        if (foundIndex !== -1) {
            currentSchemeIndex = foundIndex;
        }
    }

    renderScheme();
    renderModalList();
    initActionButtons();

    // Theme Toggle Listener
    const themeBtn = document.getElementById('theme-toggle');
    if(themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
}

function updatePlayPauseIcons(playing) {
    const mainPlayBtn = document.getElementById('main-play-btn');
    const bottomPlayBtn = document.getElementById('bp-play-btn');
    const icon = playing ? '⏸' : '▶';

    if (mainPlayBtn) mainPlayBtn.innerHTML = icon;
    if (bottomPlayBtn) bottomPlayBtn.innerHTML = icon;
}

function togglePlay() {
    const scheme = schemes[currentSchemeIndex];
    if (!scheme.videoId) {
        showToast("এই প্রকল্পের অডিও শীঘ্রই আসছে!");
        return;
    }

    if (!player || !player.playVideo || !isPlayerReady) return;

    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function skip(seconds) {
    const scheme = schemes[currentSchemeIndex];
    if (!scheme.videoId) return;

    if (!player || !player.getCurrentTime || !isPlayerReady) return;
    const currentTime = player.getCurrentTime();
    player.seekTo(currentTime + seconds, true);
}

function startProgressUpdate() {
    updateInterval = setInterval(updateProgress, 500);
}

function stopProgressUpdate() {
    clearInterval(updateInterval);
}

function updateProgress() {
    const scheme = schemes[currentSchemeIndex];
    if (!scheme.videoId) return;

    if (player && player.getCurrentTime && player.getDuration) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();

        if (duration > 0) {
            const progress = (currentTime / duration) * 100;
            document.getElementById('progress-fill').style.width = progress + '%';
            document.getElementById('current-time').textContent = formatTime(currentTime);
            document.getElementById('total-time').textContent = formatTime(duration);
        }
    }
}

function updateTimeDisplay() {
    const scheme = schemes[currentSchemeIndex];
    if (!scheme.videoId) return;

    if (player && player.getDuration) {
        const duration = player.getDuration();
        document.getElementById('total-time').textContent = formatTime(duration);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function loadScheme(index) {
    if (index < 0 || index >= schemes.length) return;

    // Add transition effect class
    const card = document.getElementById('main-card');
    const iconElement = document.getElementById('scheme-icon');

    card.classList.remove('scheme-transition');
    void card.offsetWidth; // trigger reflow
    card.classList.add('scheme-transition');

    iconElement.classList.remove('bounce-on-load');
    void iconElement.offsetWidth;
    iconElement.classList.add('bounce-on-load');

    const wasPlaying = isPlaying;
    currentSchemeIndex = index;
    const scheme = schemes[currentSchemeIndex];

    if (isPlayerReady && player && player.loadVideoById) {
        if (scheme.videoId) {
            player.loadVideoById(scheme.videoId);
            if (!wasPlaying) {
                player.pauseVideo();
            }
        } else {
            if (isPlaying) {
                player.stopVideo();
                isPlaying = false;
                updatePlayPauseIcons(false);
                stopProgressUpdate();
                document.getElementById('visualizer').classList.remove('active');
            }
        }
    }

    renderScheme();
    renderModalList();
}

function nextScheme() {
    let nextIndex = currentSchemeIndex + 1;
    if (nextIndex >= schemes.length) {
        nextIndex = 0;
    }
    loadScheme(nextIndex);
}

function prevScheme() {
    let prevIndex = currentSchemeIndex - 1;
    if (prevIndex < 0) {
        prevIndex = schemes.length - 1;
    }
    loadScheme(prevIndex);
}

function renderScheme() {
    const scheme = schemes[currentSchemeIndex];
    const hasAudio = !!scheme.videoId;

    document.getElementById('scheme-number').textContent = `প্রকল্প ${currentSchemeIndex + 1} / ${schemes.length}`;
    document.getElementById('scheme-icon').textContent = scheme.icon;
    document.getElementById('scheme-title').textContent = scheme.title;
    document.getElementById('scheme-desc').textContent = scheme.description;

    // Update Apply Button
    const applyBtn = document.getElementById('apply-btn');
    if (applyBtn) {
        // In a real scenario, this would come from the scheme object.
        // For now, we link to a placeholder or a default portal based on scheme ID.
        applyBtn.href = `https://gazole.gov.in/apply?scheme=${scheme.id}`;
    }

    // Stop TTS if it was reading the previous scheme
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const ttsBtn = document.getElementById('tts-btn');
        if (ttsBtn) ttsBtn.innerHTML = '🔊 পড়ুন';
    }

    // Update URL without reloading (Deep Linking)
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('scheme', scheme.id);
    window.history.replaceState({path: newUrl.href}, '', newUrl.href);

    const comingSoonBadge = document.getElementById('coming-soon-badge');
    const controls = document.querySelectorAll('.ctrl-btn, .play-pause-btn, .bp-ctrl-btn, .bp-play-btn');

    if (hasAudio) {
        document.getElementById('audio-duration-text').textContent = `সময়কাল: ${scheme.durationText}`;
        comingSoonBadge.style.display = 'none';
        controls.forEach(c => c.classList.remove('disabled'));
    } else {
        document.getElementById('audio-duration-text').textContent = `অডিও উপলব্ধ নয়`;
        comingSoonBadge.style.display = 'inline-block';
        controls.forEach(c => c.classList.add('disabled'));
    }

    // Bottom player updates
    document.getElementById('bp-title').textContent = scheme.title;
    document.getElementById('bp-mini-icon').textContent = scheme.icon;

    // Reset progress
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('current-time').textContent = '0:00';
    if (!hasAudio) {
         document.getElementById('total-time').textContent = '0:00';
    } else {
        updateTimeDisplay();
    }
}

// Progress Bar clicking
function seek(event) {
    const scheme = schemes[currentSchemeIndex];
    if (!scheme.videoId) return;

    if (!player || !player.getDuration || !isPlayerReady) return;

    const progressBar = document.getElementById('progress-bar-bg');
    const rect = progressBar.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / progressBar.offsetWidth;
    const duration = player.getDuration();

    if (duration > 0) {
        player.seekTo(pos * duration, true);
    }
}

// --- Modal Functions ---
function openModal() {
    document.getElementById('scheme-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('scheme-modal').classList.remove('active');
}

function renderModalList() {
    const listContainer = document.getElementById('modal-scheme-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    schemes.forEach((scheme, index) => {
        const item = document.createElement('div');
        item.className = `scheme-list-item ${index === currentSchemeIndex ? 'active' : ''}`;
        item.onclick = () => {
            loadScheme(index);
            closeModal();
        };

        const statusClass = scheme.videoId ? 'available' : 'unavailable';
        const statusText = scheme.videoId ? 'অডিও উপলব্ধ' : 'শীঘ্রই আসছে';

        item.innerHTML = `
            <div class="sli-icon">${scheme.icon}</div>
            <div class="sli-info">
                <div class="sli-title">${scheme.title}</div>
                <div class="sli-desc">${scheme.description.substring(0, 50)}...</div>
                <div class="sli-status ${statusClass}">${statusText}</div>
            </div>
        `;
        listContainer.appendChild(item);
    });
}

window.onclick = function(event) {
    const modal = document.getElementById('scheme-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// --- Premium Features ---

// Toast Notification
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Action Button Listeners
function initActionButtons() {
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) shareBtn.addEventListener('click', shareScheme);

    const ttsBtn = document.getElementById('tts-btn');
    if (ttsBtn) ttsBtn.addEventListener('click', readSchemeDescription);
}

// Read Aloud (TTS) Functionality
function readSchemeDescription() {
    if (!('speechSynthesis' in window)) {
        showToast("আপনার ব্রাউজার অডিও সমর্থন করে না।");
        return;
    }

    const scheme = schemes[currentSchemeIndex];
    const textToRead = `${scheme.title}. ${scheme.description}`;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'bn-IN'; // Bengali (India)

    // Optional: add a visual indicator while speaking
    const ttsBtn = document.getElementById('tts-btn');
    utterance.onstart = () => { if(ttsBtn) ttsBtn.innerHTML = '🔊 পড়ছে...'; };
    utterance.onend = () => { if(ttsBtn) ttsBtn.innerHTML = '🔊 পড়ুন'; };
    utterance.onerror = () => { if(ttsBtn) ttsBtn.innerHTML = '🔊 পড়ুন'; };

    window.speechSynthesis.speak(utterance);
}

// Share Functionality
function shareScheme() {
    const scheme = schemes[currentSchemeIndex];
    const schemeUrl = new URL(window.location.href);
    schemeUrl.searchParams.set('scheme', scheme.id);

    const shareData = {
        title: `Gazole Block - ${scheme.title}`,
        text: scheme.description,
        url: schemeUrl.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback to copy link
        navigator.clipboard.writeText(schemeUrl.href)
            .then(() => showToast("লিঙ্ক কপি করা হয়েছে!"))
            .catch(() => showToast("লিঙ্ক কপি করা যায়নি"));
    }
}

// Dark Mode Theme Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const iconEl = document.querySelector('.theme-icon');
    if(iconEl) {
        iconEl.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

function toggleMobileMenu() {
    showToast("মেনু শীঘ্রই আসছে!");
}

// Network Status Handling
function updateOnlineStatus() {
    if (!navigator.onLine) {
        showToast("আপনি এখন অফলাইনে আছেন। অডিও নাও চলতে পারে।");
        document.body.classList.add('offline-mode');
    } else {
        if (document.body.classList.contains('offline-mode')) {
            showToast("ইন্টারনেট সংযোগ ফিরে এসেছে!");
            document.body.classList.remove('offline-mode');
        }
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    updateOnlineStatus();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.error('ServiceWorker registration failed: ', error);
            });
    }
});
