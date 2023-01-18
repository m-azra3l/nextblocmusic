import React, { useState } from 'react'

const PlayBar = () => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(0.5)

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    const handleTimeUpdate = (e) => {
        setCurrentTime(e.target.currentTime)
        setDuration(e.target.duration)
    }

    const handleVolumeChange = (e) => {
        setVolume(e.target.value)
    }

    const handleSeekChange = (e) => {
        setCurrentTime(e.target.value)
    }

    return (
        <div className="play-bar" style={{position: 'fixed', bottom: '0', width: '100%', backgroundColor: '#f4f4f4'}}>
            <audio volume={volume} onTimeUpdate={handleTimeUpdate}>
                <source src="your-audio-source.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <div className="play-bar-controls">
                <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
                <div className="time-display">
                    {currentTime} / {duration}
                </div>
                <div className="volume-control">
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
                </div>
                <div className="seek-control">
                    <input type="range" min="0" max={duration} value={currentTime} onChange={handleSeekChange} />
                </div>
            </div>
        </div>
    )
}

export default PlayBar
