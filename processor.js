// processor.js
class WorkletProcessor extends AudioWorkletProcessor {
  shouldProcess = true;
  leftChannelData = [];

  constructor(props) {
    super(props);

    this.port.onmessage = (event) => {
      if (event.data === "stop") {
        this.shouldProcess = false;
        this.port.postMessage({
          type: 'data',
          samples: this.leftChannelData,
        })
      }
    };
  }

  convert32to16bit(channelChunk) {
    const data = Int16Array.from(channelChunk, n => {
      const res = n < 0 ? n * 32768 : n * 32767 // [-32768, 32767]
      return Math.max(-32768, Math.min(32767, res)) // clamp
    })

    this.leftChannelData = Int16Array.from([...this.leftChannelData, ...data])
  }

  process(inputs, outputs) {
    const [leftChannel, rightChannel] = inputs[0];
    this.convert32to16bit(leftChannel);
    return this.shouldProcess;
  }
}

registerProcessor("worklet-processor", WorkletProcessor);
