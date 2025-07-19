
        console.log("Welcome to Enhanced Spotify Clone");

        // Audio setup 
        let songIndex = 0;
        let audioElement = new Audio();
        let masterPlay = document.getElementById('masterPlay');
        let progressBar = document.getElementById('progressBar');
        let gif = document.getElementById('gif');
        let songInfo = document.getElementById('songInfo');
        let currentSongCover = document.getElementById('currentSongCover');
        let currentSongTitle = document.getElementById('currentSongTitle');
        let currentSongArtist = document.getElementById('currentSongArtist');
        let masterSongName = document.getElementById('masterSongName');
        let masterArtist = document.getElementById('masterArtist');
        let currentTime = document.getElementById('currentTime');
        let totalTime = document.getElementById('totalTime');
        let volumeBar = document.getElementById('volumeBar');
        let volumeIcon = document.getElementById('volumeIcon');

        let songs = [
            {
                songName: "Tum Prem Ho", 
                artist: "Arun Prajith",
                filePath: "songs/1.mp3", 
                coverPath: "images/1.jpeg"
            },
            {
                songName: "O Kanha ab toh Murli", 
                artist: "Chetna",
                filePath: "songs/2.mp3", 
                coverPath: "images/2.jpg"
            },
            {
                songName: "Mere Kanha", 
                artist: "Unknown Artist",
                filePath: "songs/3.mp3", 
                coverPath: "images/3.jpg"
            },
            {
                songName: "Arti Kunj Bihari Ki", 
                artist: "Traditional",
                filePath: "songs/4.mp3", 
                coverPath: "images/4.jpg"
            },
            {
                songName: "Ram Siya Ram", 
                artist: "Sachet Tandon",
                filePath: "songs/5.mp3", 
                coverPath: "images/5.jpg"
            },
            {
                songName: "Shri Krishna Govind", 
                artist: "Traditional",
                filePath: "songs/6.mp3", 
                coverPath: "images/6.png"
            }
        ];

        // Initialize first song
        audioElement.src = songs[0].filePath;
        updateSongInfo(0);

        // Format time function
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Update song information
        function updateSongInfo(index) {
            const song = songs[index];
            masterSongName.innerText = song.songName;
            masterArtist.innerText = song.artist;
            currentSongTitle.innerText = song.songName;
            currentSongArtist.innerText = song.artist;
            currentSongCover.src = song.coverPath;
            gif.src = song.coverPath;
        }

        // Master play/pause functionality
        masterPlay.addEventListener('click', () => {
            if (audioElement.paused || audioElement.currentTime <= 0) {
                audioElement.play();
                masterPlay.classList.remove('fa-circle-play');
                masterPlay.classList.add('fa-circle-pause');
                songInfo.classList.add('playing');
                document.querySelector(`[data-index="${songIndex}"] .songItemPlay`).classList.remove('fa-circle-play');
                document.querySelector(`[data-index="${songIndex}"] .songItemPlay`).classList.add('fa-circle-pause');
                document.querySelector(`[data-index="${songIndex}"]`).classList.add('playing');
            } else {
                audioElement.pause();
                masterPlay.classList.remove('fa-circle-pause');
                masterPlay.classList.add('fa-circle-play');
                songInfo.classList.remove('playing');
                document.querySelector(`[data-index="${songIndex}"] .songItemPlay`).classList.remove('fa-circle-pause');
                document.querySelector(`[data-index="${songIndex}"] .songItemPlay`).classList.add('fa-circle-play');
                document.querySelector(`[data-index="${songIndex}"]`).classList.remove('playing');
            }
        });

        // Progress bar update
        audioElement.addEventListener('timeupdate', () => {
            const progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
            progressBar.value = progress;
            currentTime.innerText = formatTime(audioElement.currentTime);
            
            if (!isNaN(audioElement.duration)) {
                totalTime.innerText = formatTime(audioElement.duration);
            }
        });

        // Progress bar seek
        progressBar.addEventListener('change', () => {
            audioElement.currentTime = progressBar.value * audioElement.duration / 100;
        });

        // Volume control
        volumeBar.addEventListener('input', () => {
            audioElement.volume = volumeBar.value / 100;
            updateVolumeIcon();
        });

        function updateVolumeIcon() {
            const volume = volumeBar.value;
            if (volume == 0) {
                volumeIcon.className = 'fa-solid fa-volume-xmark';
            } else if (volume < 50) {
                volumeIcon.className = 'fa-solid fa-volume-low';
            } else {
                volumeIcon.className = 'fa-solid fa-volume-high';
            }
        }

        // Volume icon click to mute/unmute
        volumeIcon.addEventListener('click', () => {
            if (audioElement.volume > 0) {
                audioElement.volume = 0;
                volumeBar.value = 0;
            } else {
                audioElement.volume = 1;
                volumeBar.value = 100;
            }
            updateVolumeIcon();
        });

        // Reset all play buttons
        const makeAllPlays = () => {
            Array.from(document.getElementsByClassName("songItemPlay")).forEach((element) => {
                element.classList.remove('fa-circle-pause');
                element.classList.add('fa-circle-play');
            });
            
            Array.from(document.getElementsByClassName("item")).forEach((element) => {
                element.classList.remove('playing');
            });
        }

        // Individual song play buttons
        Array.from(document.getElementsByClassName("songItemPlay")).forEach((element) => {
            element.addEventListener('click', (e) => {
                const clickedIndex = parseInt(e.target.dataset.index);
                
                if (songIndex === clickedIndex && !audioElement.paused) {
                    // Pause current song
                    audioElement.pause();
                    masterPlay.classList.remove('fa-circle-pause');
                    masterPlay.classList.add('fa-circle-play');
                    e.target.classList.remove('fa-circle-pause');
                    e.target.classList.add('fa-circle-play');
                    songInfo.classList.remove('playing');
                    document.querySelector(`[data-index="${songIndex}"]`).classList.remove('playing');
                } else {
                    // Play new song or resume
                    makeAllPlays();
                    songIndex = clickedIndex;
                    e.target.classList.remove('fa-circle-play');
                    e.target.classList.add('fa-circle-pause');
                    audioElement.src = songs[songIndex].filePath;
                    updateSongInfo(songIndex);
                    audioElement.currentTime = 0;
                    audioElement.play();
                    songInfo.classList.add('playing');
                    masterPlay.classList.remove('fa-circle-play');
                    masterPlay.classList.add('fa-circle-pause');
                    document.querySelector(`[data-index="${songIndex}"]`).classList.add('playing');
                }
            });
        });

        // Next song
        document.getElementById('next').addEventListener('click', () => {
            songIndex = (songIndex >= songs.length - 1) ? 0 : songIndex + 1;
            playNewSong();
        });

        // Previous song
        document.getElementById('previous').addEventListener('click', () => {
            songIndex = (songIndex <= 0) ? songs.length - 1 : songIndex - 1;
            playNewSong();
        });

        function playNewSong() {
            makeAllPlays();
            audioElement.src = songs[songIndex].filePath;
            updateSongInfo(songIndex);
            audioElement.currentTime = 0;
            audioElement.play();
            songInfo.classList.add('playing');
            masterPlay.classList.remove('fa-circle-play');
            masterPlay.classList.add('fa-circle-pause');
            document.querySelector(`[data-index="${songIndex}"] .songItemPlay`).classList.remove('fa-circle-play');
            document.querySelector(`[data-index="${songIndex}"] .songItemPlay`).classList.add('fa-circle-pause');
            document.querySelector(`[data-index="${songIndex}"]`).classList.add('playing');
        }

        // Auto next song when current ends
        audioElement.addEventListener('ended', () => {
            document.getElementById('next').click();
        });

        // Item click to play song
        Array.from(document.getElementsByClassName("item")).forEach((element) => {
            element.addEventListener('click', (e) => {
                if (!e.target.classList.contains('songItemPlay')) {
                    const playButton = element.querySelector('.songItemPlay');
                    playButton.click();
                }
            });
        });
