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
      beep C
    </div>
    {{msg}}
    {{this.err}}
    {{this.volume}}
  </div>
</template>

<script>
import sineGenerator from '../instruments/sine'
const AudioContext = window.AudioContext || window.webkitAudioContext;

export default {
  data: function () {
    return {
      audioContext: null,
      volumeProcessingAudioContext: null,
      sounds: null,
      volume: 0,
      volumeProcessingStarted: false,
      msg: 'start message',
      err: 'no error'
    }
  },
  created: function () {
    this.audioContext = new AudioContext()
    this.sounds = {}
    this.setupVolumeProcessing()
  },
  name: 'Instrument',
  methods: {
    setupVolumeProcessing: function() {
      this.msg = 'settingup'
      navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
      }).then(stream => {
        this.msg = 'settingup: got strem'
        this.volumeProcessingAudioContext = new AudioContext()
        const mediaStreamSource = this.volumeProcessingAudioContext.createMediaStreamSource(stream)
        var processor = this.volumeProcessingAudioContext.createScriptProcessor(512)
        mediaStreamSource.connect(processor)
        processor.onaudioprocess = this.volumeAudioProcess
        processor.connect(this.volumeProcessingAudioContext.destination)
      }).catch(err => this.err = err)
    },
    volumeAudioProcess: function (event) {
      this.err = 'asd'
      var buf = event.inputBuffer.getChannelData(0);
      var bufLength = buf.length;
      var sum = 0;
      var x;
      var clipLevel = clipLevel || 0.98
      var averaging = averaging || 0.95
      var clipping, lastClip

      for (var i=0; i< bufLength; i++) {
        x = buf[i];
        if (Math.abs(x) >= clipLevel) {
          clipping = true;
          lastClip = window.performance.now();
        }
        sum += x * x;
      }

      var rms =  Math.sqrt(sum / bufLength);
      const vol = Math.max(rms, this.volume*averaging)
      if(!isNaN(vol)) {
        this.volume = Math.max(rms, this.volume*averaging)
        Object.keys(this.sounds).forEach(k => {
          if(this.sounds[k]) {
            this.sounds[k].gain.gain.value = this.volume
          }
        })
      }
    },
    playSound: function (freq) {
      this.volumeProcessingAudioContext.resume()
      const freqKey = freq.toString()
      this.sounds[freqKey] = sineGenerator(freq, this.audioContext)
      this.sounds[freqKey].gain.gain.value = this.volume
      this.sounds[freqKey].oscillator.start()
    },
    stopSound: function (freq) {
      const freqKey = freq.toString()
      if(this.sounds[freqKey]) {
        this.sounds[freqKey].oscillator.stop()
        this.sounds[freqKey] = null
      }
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
