import wav from "wav";
import { Stream } from "stream"


async function convertIntoWav(
    pcmData,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
) {
  try {
    const writer = new wav.Writer(
      {
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      }
    )  
    console.log("wav created")
    var chunks = []
  
    const passTrough = new Stream.PassThrough()
    passTrough.on('data' , data=>chunks.push(data))
    writer.pipe(passTrough)
    console.log("stream attached")
    const done = new Promise(resolve => writer.on('finish' , resolve))
    
    writer.write(pcmData)
    console.log("sending data to writer")
    writer.end()
    console.log("data sended")
  
    await done
    // console.log("buffer: " , chunks)
    return Buffer.concat(chunks)
  } catch (error) {
    console.log(error.messsage)
    return true
  }
}

export default convertIntoWav  