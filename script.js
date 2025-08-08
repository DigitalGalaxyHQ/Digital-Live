document.addEventListener('DOMContentLoaded', function() {
    const videoPlayer = document.getElementById('main-player');
    const currentChannelDisplay = document.getElementById('current-channel');
    const channelGrid = document.querySelector('.channel-grid');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const searchInput = document.querySelector('.search input');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const volumeBtn = document.getElementById('volume-btn');
    const favoriteBtn = document.getElementById('favorite-btn');

    let hls;
    if (Hls.isSupported()) {
        hls = new Hls();
    }

    let channels = [];

    // Load channels from JSON file
    fetch('channels.json')
        .then(response => response.json())
        .then(data => {
            channels = data.channels;
            loadChannels();
        })
        .catch(error => {
            console.error('Error loading channels:', error);
            channelGrid.innerHTML = '<p class="no-results">Error loading channels. Please try again later.</p>';
        });

    function loadChannels(filter = 'all', searchTerm = '') {
        channelGrid.innerHTML = '';
        
        const filteredChannels = channels.filter(channel => {
            const matchesCategory = filter === 'all' || channel.category === filter;
            const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filteredChannels.length === 0) {
            channelGrid.innerHTML = '<p class="no-results">No channels found matching your criteria.</p>';
            return;
        }

        filteredChannels.forEach(channel => {
            const channelCard = document.createElement('div');
            channelCard.className = 'channel-card';
            channelCard.dataset.id = channel.id;
            
            channelCard.innerHTML = `
                <div class="channel-logo">
                    <img src="${channel.logo}" alt="${channel.name} Logo" onerror="this.src='https://via.placeholder.com/100?text=${channel.name.split(' ').join('+')}'">
                </div>
                <div class="channel-info">
                    <h3>${channel.name}</h3>
                    <p>${channel.category.charAt(0).toUpperCase() + channel.category.slice(1)}</p>
                </div>
            `;
            
            channelCard.addEventListener('click', () => playChannel(channel));
            channelGrid.appendChild(channelCard);
        });
    }

    function playChannel(channel) {
        currentChannelDisplay.textContent = channel.name;
        
        if (Hls.isSupported()) {
            if (hls) {
                hls.destroy();
            }
            hls = new Hls();
            hls.loadSource(channel.url);
            hls.attachMedia(videoPlayer);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                videoPlayer.play();
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = channel.url;
            videoPlayer.addEventListener('loadedmetadata', function() {
                videoPlayer.play();
            });
        } else {
            alert('Your browser does not support HLS streaming.');
        }
    }

    // Rest of your event listeners remain the same
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadChannels(tab.dataset.category, searchInput.value);
        });
    });

    searchInput.addEventListener('input', () => {
        const activeTab = document.querySelector('.category-tab.active');
        loadChannels(activeTab.dataset.category, searchInput.value);
    });

    fullscreenBtn.addEventListener('click', () => {
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.webkitRequestFullscreen) {
            videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) {
            videoPlayer.msRequestFullscreen();
        }
    });

    volumeBtn.addEventListener('click', () => {
        if (videoPlayer.muted) {
            videoPlayer.muted = false;
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            videoPlayer.muted = true;
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });

    favoriteBtn.addEventListener('click', () => {
        favoriteBtn.classList.toggle('far');
        favoriteBtn.classList.toggle('fas');
    });
});