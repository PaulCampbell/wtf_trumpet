<template>
  <div>
    <h1>Instrument</h1>
    <div v-on:touchstart="playSound(440)"
      v-on:touchend="stopSound(440)"
      class="noteButton">
      beep A
    </div>
    <div v-on:touchstart="playSound(660)"
      v-on:touchend="stopSound(660)"
      class="noteButton">
      beep B
    </div>
    <div v-on:touchstart="playSound(880)"
      v-on:touchend="stopSound(880)"
      class="noteButton">
      beep B
    </div>
    {{msg}}
    <input type="range" min="0" max="1" step="0.02" v-model="volume">
    volume
    </input>
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
    playSound: function (freq) {
      const freqKey = freq.toString()
      this.sounds[freqKey] = sineGenerator(freq, this.audioContext)
      this.sounds[freqKey].gain.gain.value = this.volume
      this.sounds[freqKey].oscillator.start()
      this.msg = `${freq} start`
    },
    stopSound: function (freq) {
      const freqKey = freq.toString()
      if(this.sounds[freqKey]) {
        this.sounds[freqKey].oscillator.stop()
        this.sounds[freqKey] = null
        this.msg = `${freq} stop`
      }
    }
  },
  data () {
    return {
      msg: 'Hold a key and blow into the phone mic'
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
.noteButton {
  border:solid 1px red;
  padding:1.5em;
  user-select: none;
  -webkit-user-select: none;
}
</style>
