<template>
  <div>
    <h1>Instrument</h1>
    <div
      @mousedown="playSound(event, 440)"
      @mouseout="stopSound(event, 440)"
      @mouseup="stopSound(event, 440)">
      beep A
    </div>
    <div
      @mousedown="playSound(event, 660)"
      @mouseout="stopSound(event, 660)"
      @mouseup="stopSound(event, 660)">
      beep B
    </div>
    <input type="range" min="0" max="1" step="0.02" v-model="volume"></input>
  </div>
</template>
<script>
import { AudioContext } from 'standardized-audio-context'
import sineGenerator from '../instruments/sine'

export default {
  data: function () {
    return {
      audioContext: null,
      sounds: null,
      volume: null
    }
  },
  created: function () {
    this.audioContext = new AudioContext()
    this.sounds = {}
    this.volume = 0.5
  },
  name: 'Instrument',
  methods: {
    playSound: function (event, freq) {
      const freqKey = freq.toString()
      this.sounds[freqKey] = sineGenerator(freq, this.audioContext)
      this.sounds[freqKey].gain.gain.value = this.volume
      this.sounds[freqKey].oscillator.start()
    },
    stopSound: function (event, freq) {
      const freqKey = freq.toString()
      if(this.sounds[freqKey]) {
        this.sounds[freqKey].oscillator.stop()
        this.sounds[freqKey] = null
      }
    }
  },
  data () {
    return {
      msg: 'Blow in your mic'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
