'use server'

import { YoutubeTranscript } from "youtube-transcript";
import { generateText } from "ai";
import { ollama } from "ollama-ai-provider";

  // Function to handle fetching the transcript
  export const loadTranscript = async (youtubeUrl: string) => {

    try {
      const transcript  = await YoutubeTranscript.fetchTranscript(youtubeUrl);

      let newTranscript = '';

      for (let i = 0; i < transcript.length; i++) {
        newTranscript += `${transcript[i].text}\n`;
      }

      return newTranscript

    } catch (err) {
      console.error('Error fetching transcript:', err);
      return "Error occured"
    } 
  };


  // Function to handle fetching the transcript
  export const enhanceTranscript = async (transcript: string) => {

    try {
         // Call model to summarize text
         console.log("Enhaning...")
    const { text } = await generateText({
        model: ollama("llama3.1"),
        //prompt: `Summarize the text, highlight the key points and output as markdown. Text: ${data}`,
        prompt: `Correct this text: ${transcript}`,
      });

      return text

    } catch (err) {
      console.error('Error enhancing transcript:', err);
      return "Error occured"
    } 
  };

  export async function splitIntoChunks(transcript: string, chunkSize: number = 500): Promise<string[]> {
    // Split the transcript into words
    const words = transcript.split(' ');
    
    // Initialize an array to hold the chunks
    const chunks: string[] = [];
    
    // Loop through the words array in steps of chunkSize
    for (let i = 0; i < words.length; i += chunkSize) {
        // Slice the words array to get the chunk and join them back into a string
        const chunk = words.slice(i, i + chunkSize).join(' ');
        chunks.push(chunk);
    }

    return chunks;
}

