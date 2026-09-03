// Scheme Data Structure
const schemes = [
    {
        id: 1,
        title: "সামাজিক সুরক্ষা ভাতা",
        description: "বয়স্ক, বিধবা ও বিশেষ চাহিদা সম্পন্ন নাগরিকদের জন্য মাসিক আর্থিক অনুদান।",
        icon: "👵",
        videoId: "v3gwlHi1J6A", // Only this scheme has the video ID
        durationText: "২ মিনিট ১৫ সেকেন্ড",
        shortName: "সুরক্ষা ভাতা"
    },
    {
        id: 2,
        title: "Annapurna Yojana",
        description: "মহিলাদের স্বনির্ভর করতে মাসিক আর্থিক অনুদান প্রকল্প।",
        icon: "💰",
        videoId: null,
        durationText: "--",
        shortName: "Annapurna Yojana"
    },
    {
        id: 3,
        title: "প্রধানমন্ত্রী আবাস যোজনা (গ্রামীণ)",
        description: "গ্রামীণ এলাকার দরিদ্র ও গৃহহীন পরিবারকে পাকা বাড়ি নির্মাণের জন্য আর্থিক সহায়তা।",
        icon: "🏠",
        videoId: null,
        durationText: "--",
        shortName: "আবাস যোজনা"
    },
    {
        id: 4,
        title: "কন্যাশ্রী প্রকল্প",
        description: "বাল্যবিবাহ রোধ এবং মেয়েদের শিক্ষার প্রসারে আর্থিক অনুদান।",
        icon: "👩",
        videoId: null,
        durationText: "--",
        shortName: "কন্যাশ্রী"
    },
    {
        id: 5,
        title: "কৃষক বন্ধু প্রকল্প",
        description: "কৃষকদের আর্থ-সামাজিক উন্নয়ন ও কৃষি কাজে সহায়তার জন্য অনুদান।",
        icon: "👨‍🌾",
        videoId: null,
        durationText: "--",
        shortName: "কৃষক বন্ধু"
    },
    {
        id: 6,
        title: "Ayushman Card",
        description: "প্রতিটি পরিবারকে বছরে ৫ লক্ষ টাকা পর্যন্ত বিনামূল্যে চিকিৎসার সুবিধা।",
        icon: "❤️",
        videoId: null,
        durationText: "--",
        shortName: "Ayushman Card"
    },
    {
        id: 7,
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
    // Only initialize player with valid videoId
    const initialVideoId = schemes[currentSchemeIndex].videoId || 'v3gwlHi1J6A'; // default fallback for init

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
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        isPlaying = false;
        updatePlayPauseIcons(false);
        stopProgressUpdate();
    }
}

function initApp() {
    renderScheme();
    renderModalList();
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
        alert("এই প্রকল্পের অডিও শীঘ্রই আসছে!");
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
            // Stop current playback if switching to a scheme without audio
            if (isPlaying) {
                player.stopVideo();
                isPlaying = false;
                updatePlayPauseIcons(false);
                stopProgressUpdate();
            }
        }
    }

    // Update UI
    renderScheme();
    renderModalList();
}

function nextScheme() {
    let nextIndex = currentSchemeIndex + 1;
    if (nextIndex >= schemes.length) {
        nextIndex = 0; // Loop back to start
    }
    loadScheme(nextIndex);
}

function prevScheme() {
    let prevIndex = currentSchemeIndex - 1;
    if (prevIndex < 0) {
        prevIndex = schemes.length - 1; // Loop back to end
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

    // Reset progress
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('current-time').textContent = '0:00';
    if (!hasAudio) {
         document.getElementById('total-time').textContent = '0:00';
    } else {
        updateTimeDisplay();
    }
}

function renderDots() {
    const dotsContainer = document.getElementById('scheme-dots');
    dotsContainer.innerHTML = '';

    schemes.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === currentSchemeIndex ? 'active' : ''}`;
        dot.onclick = () => loadScheme(index);
        dotsContainer.appendChild(dot);
    });
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === currentSchemeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function renderQuickSelect() {
    const container = document.getElementById('shortcuts-container');
    container.innerHTML = '';

    // Only show first 4 schemes as shortcuts + "See All"
    const displaySchemes = schemes.slice(0, 4);

    displaySchemes.forEach((scheme, index) => {
        const btn = document.createElement('button');
        btn.className = `shortcut-btn ${index === currentSchemeIndex ? 'active' : ''}`;
        btn.innerHTML = `<span>${scheme.icon}</span> ${scheme.shortName}`;
        btn.onclick = () => loadScheme(index);
        container.appendChild(btn);
    });

    // Add "See All" button
    const seeAllBtn = document.createElement('button');
    seeAllBtn.className = 'shortcut-btn';
    seeAllBtn.innerHTML = `<span>▦</span> সব দেখুন`;
    seeAllBtn.onclick = openModal;
    container.appendChild(seeAllBtn);
}

function updateQuickSelect() {
    const buttons = document.querySelectorAll('.shortcuts-container .shortcut-btn');
    buttons.forEach((btn, index) => {
        // Skip the "See All" button
        if (index < 4) {
            if (index === currentSchemeIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });
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
                <div class="sli-desc">${scheme.description.substring(0, 45)}...</div>
            </div>
            <div class="sli-status ${statusClass}">${statusText}</div>
        `;
        listContainer.appendChild(item);
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('scheme-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initApp);
