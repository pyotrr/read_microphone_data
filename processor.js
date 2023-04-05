class WorkletProcessor extends AudioWorkletProcessor {
  shouldProcess = true;
  leftChannelData = [];

  constructor(props) {
    super(props);

    this.port.onmessage = (event) => {
      // jak dostaniesz wiadomość stop to przerwij peocessing i zwróć zebrane dane
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
      const res = n < 0 ? n * 32768 : n * 32767 // array będize w takim zakresie [-32768, 32767]
      return Math.max(-32768, Math.min(32767, res)) // clamp
    })

    // dopisz przekonwertowane sample do `this.leftChannelData`
    this.leftChannelData = Int16Array.from([...this.leftChannelData, ...data])
  }

  process(inputs, outputs) {
    const [leftChannel, rightChannel] = inputs[0];

    // to się wywołuje po każdych 128 próbkach
    this.convert32to16bit(leftChannel);

    // `process` się wywołuje w pętli, aż do zwrócenia false
    return this.shouldProcess;
  }
}

registerProcessor("worklet-processor", WorkletProcessor);
