
    function showSection(sectionId) {
      const sections = document.querySelectorAll('.section');
      sections.forEach(section => section.classList.remove('active'));
      document.getElementById(sectionId).classList.add('active');
    }
    async function handleSearch() {
      const query = document.getElementById('searchInput').value;
      if (!query) return;
      document.getElementById('loading').style.display = 'block';
      document.getElementById('results').innerHTML = '';
      setTimeout(async () => {
        const tracks = await searchSpotifyTracks(query);
        document.getElementById('loading').style.display = 'none';
        displaySearchResults(tracks);
      }, 2000);
    }
    async function searchSpotifyTracks(query) {
      const clientId = 'acc6302297e040aeb6e4ac1fbdfd62c3';
      const clientSecret = '0e8439a1280a43aba9a5bc0a16f3f009';
      const auth = btoa(`${clientId}:${clientSecret}`);
      const getToken = async () => {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          body: new URLSearchParams({ grant_type: 'client_credentials' }),
          headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return (await response.json()).access_token;
      };
      const accessToken = await getToken();
      const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;
      const response = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      return data.tracks.items;
    }
    function displaySearchResults(tracks) {
      const resultsContainer = document.getElementById('results');
      if (tracks.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
        return;
      }
      tracks.forEach(track => {
        const trackCard = document.createElement('div');
        trackCard.classList.add('artist-card');
        trackCard.innerHTML = `
          <img src="${track.album.images[0].url}" alt="${track.name}">
          <h3>${track.name}</h3>
          <p>${track.artists.map(artist => artist.name).join(', ')}</p>
          <button onclick="playSong('${track.preview_url}')">Play Preview</button>
        `;
        resultsContainer.appendChild(trackCard);
      });
    }
    function playSong(previewUrl) {
      const audio = new Audio(previewUrl);
      audio.play();
    }