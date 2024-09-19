"use client"
import { useState } from 'react';
import { YoutubeTranscript } from 'youtube-transcript';
import { enhanceTranscript, loadTranscript, splitIntoChunks } from './api/transcript';

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle fetching the transcript
  const fetchTranscript = async () => {
    if (!youtubeUrl) {
      alert('Please enter a valid YouTube URL.');
      return;
    }

    setLoading(true);
    setError('');
    setTranscript('');

    try {

      const transcript = await loadTranscript(youtubeUrl)
      const chunks = await splitIntoChunks(transcript, 2000);
      let enhancedTranscript = ''
      for (const transcriptChunk of chunks) {
        enhancedTranscript = `${enhancedTranscript} ${await enhanceTranscript(transcriptChunk)} `
      }
    

      setTranscript(enhancedTranscript);

    } catch (err) {
      console.error('Error fetching transcript:', err);
      setError('An error occurred while fetching the transcript');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the download of the transcript as a text file
  const handleDownload = () => {
    if (!transcript) {
      alert('No transcript to download!');
      return;
    }

    const blob = new Blob([transcript], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transcript.txt';
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">YouTube Transcript Enhancer</h1>

      {/* <img src="/logo.png" alt="Logo" className="w-32 h-32 mb-6" /> */}

      <input
        type="text"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="Enter YouTube URL"
        className="p-3 border border-gray-300 rounded-md w-80 mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={() => fetchTranscript()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md text-lg mb-4"
      >
        {loading ? 'Fetching Transcript...' : 'Get Transcript'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {transcript && (
        <div className="mt-6 bg-white p-4 rounded shadow w-80">
          <h2 className="text-lg font-bold mb-2">Transcript</h2>
          {/* <p>{transcript}</p> */}

          <button
            onClick={handleDownload}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Download Transcript
          </button>
        </div>
      )}
    </div>
  );
}
