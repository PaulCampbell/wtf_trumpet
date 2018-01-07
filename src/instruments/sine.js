module.exports = function (freq, audioContext) {
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  return {
    oscillator,
    gain
  }
}
