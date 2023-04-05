// processor.js
class WorkletProcessor extends AudioWorkletProcessor {
  shouldProcess = true;
  constructor(props) {
    super(props);

    this.port.onmessage = (event) => {
      if (event.data === "stop") {
        this.shouldProcess = false;
      }
    };
  }

  process(inputs, outputs) {
    console.log(inputs);
    return this.shouldProcess;
  }
}

registerProcessor("worklet-processor", WorkletProcessor);
