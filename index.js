(() => {
  let worklet;
  const handleSuccess = async (stream) => {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);

    await context.audioWorklet.addModule("processor.js");
    worklet = new AudioWorkletNode(context, "worklet-processor");

    source.connect(worklet);
    worklet.connect(context.destination);

    // REAGUJ NA WIADOMOŚCI OD WORKLETU
    worklet.port.onmessage = (event) => {
      // EVENT Z DANYMI JEST KSZTAŁTU `{data: {type: 'data', samples: Int16Array}}`
      if (event.data?.type === 'data') {
        console.log(event.data.samples);
      }
    }
  };

  const startButton = document.getElementById('start');
  const stopButton = document.getElementById('stop');

  const start = () => {
      navigator.mediaDevices.getUserMedia({audio: true, video: false})
        .then(handleSuccess);
  }

  startButton.addEventListener('click', start);
  stopButton.addEventListener('click', () => {
    // WYSŁANIE `stop` kończy processing w worklecie i wysyła postMessage `type` z zebranymi samplami
    worklet.port.postMessage('stop');
  })
})()
