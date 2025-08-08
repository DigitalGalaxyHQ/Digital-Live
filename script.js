document.addEventListener('DOMContentLoaded', function() {
    // Sample channel data (replace with your actual M3U8 links)
    const channels = [
        {
            id: 1,
            name: "CNN",
            logo: "https://logo.clearbit.com/cnn.com",
            category: "news",
            url: "https://example.com/cnn.m3u8"
        },
        {
            id: 2,
            name: "ESPN",
            logo: "https://logo.clearbit.com/espn.com",
            category: "sports",
            url: "https://example.com/espn.m3u8"
        },
        {
            id: 3,
            name: "HBO",
            logo: "https://logo.clearbit.com/hbo.com",
            category: "movies",
            url: "https://example.com/hbo.m3u8"
        },
        {
            id: 4,
            name: "Discovery",
            logo: "https://logo.clearbit.com/discovery.com",
            category: "entertainment",
            url: "https://example.com/discovery.m3u8"
        },
        {
            id: 5,
            name: "Cartoon Network",
            logo: "https://logo.clearbit.com/cartoonnetwork.com",
            category: "kids",
            url: "https://example.com/cartoonnetwork.m3u8"
        },
        {
            id: 6,
            name: "BBC News",
            logo: "https://logo.clearbit.com/bbc.com",
            category: "news",
            url: "https://example.com/bbc.m3u8"
        },
        {
            id: 7,
            name: "Fox Sports",
            logo: "https://logo.clearbit.com/foxsports.com",
            category: "sports",
            url: "https://example.com/foxsports.m3u8"
        },
        {
            id: 8,
            name: "National Geographic",
            logo: "https://logo.clearbit.com/nationalgeographic.com",
            category: "entertainment",
            url: "https://example.com/natgeo.m3u8"
        }
    ];

    const videoPlayer = document.getElementById('main-player');
    const currentChannelDisplay = document.getElementById('current-channel');
    const channelGrid = document.querySelector('.channel-grid');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const searchInput = document.querySelector('.search input');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const volumeBtn = document.getElementById('volume-btn');
    const favoriteBtn = document.getElementById('favorite-btn');

    // Check if HLS is supported
    let hls;
    if (Hls.isSupported()) {
        hls = new Hls();
    }

    // Load all channels
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
                    <img src="${channel.logo}" alt="${channel.name} Logo">
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

    // Play selected channel
    function playChannel(channel) {
        currentChannelDisplay.textContent = channel.name;
        
        if (Hls.isSupported()) {
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

    // Category filter
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadChannels(tab.dataset.category, searchInput.value);
        });
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const activeTab = document.querySelector('.category-tab.active');
        loadChannels(activeTab.dataset.category, searchInput.value);
    });

    // Player controls
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

    // Initialize
    loadChannels();
});