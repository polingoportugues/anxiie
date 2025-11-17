
import React, { useState, useCallback } from 'react';
import { generateWebsite } from './services/geminiService';
import { 
  LogoIcon, GiftIcon, MailIcon, CloseIcon, PlusIcon, PaperclipIcon, 
  WaveformIcon, ArrowUpIcon, SpinnerIcon 
} from './components/icons';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedHtml(null);

    try {
      const html = await generateWebsite(prompt);
      setGeneratedHtml(html);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
      setGeneratedHtml(`
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background-color: #1a1a1a; color: white;">
          <h2>Error: ${errorMessage}</h2>
        </div>
      `);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  if (generatedHtml) {
    return (
       <div className="bg-zinc-900 w-screen h-screen flex flex-col">
         <header className="flex-shrink-0 bg-zinc-800/50 backdrop-blur-sm p-3 md:p-4 flex justify-between items-center z-20 border-b border-zinc-700">
           <h2 className="text-lg font-semibold text-white">Website Preview</h2>
           <button 
             onClick={() => {
               setGeneratedHtml(null);
               setPrompt('');
             }} 
             className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
           >
             Create New
           </button>
         </header>
         <iframe
           srcDoc={generatedHtml}
           title="Website Preview"
           className="w-full h-full border-none bg-white"
           sandbox="allow-scripts allow-same-origin"
         />
       </div>
    );
  }

  return (
    <div className="bg-zinc-900 w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-blue-900/40 to-purple-800/50 opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%3E%3Cdefs%3E%3Cfilter%20id%3D%22a%22%20x%3D%22-50%25%22%20y%3D%22-50%25%22%20width%3D%22200%25%22%20height%3D%22200%25%22%3E%3CfeTurbulence%20baseFrequency%3D%22.5%22%20result%3D%22t%22%2F%3E%3CfeSpecularLighting%20in%3D%22t%22%20surfaceScale%3D%223%22%20specularConstant%3D%22.5%22%20specularExponent%3D%2220%22%20lighting-color%3D%22%23222%22%20result%3D%22sl%22%3E%3CfeDistantLight%20azimuth%3D%223%22%20elevation%3D%22100%22%2F%3E%3C%2FfeSpecularLighting%3E%3CfeComposite%20in%3D%22sl%22%20in2%3D%22t%22%20operator%3D%22arithmetic%22%20k1%3D%220%22%20k2%3D%221%22%20k3%3D%221%22%20k4%3D%220%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23a)%22%2F%3E%3C%2Fsvg%3E')] opacity-[0.03] mix-blend-soft-light"></div>
      
      <div className="relative z-10 flex flex-col h-full p-4 md:p-6 text-white">
        <header className="flex justify-between items-center w-full">
          <LogoIcon />
          <div className="flex items-center gap-4 text-zinc-400">
            <GiftIcon className="w-6 h-6 hover:text-white transition-colors cursor-pointer" />
            <div className="relative">
              <MailIcon className="w-6 h-6 hover:text-white transition-colors cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-900"></div>
            </div>
            <button className="bg-purple-600/80 text-white rounded-lg p-2 hover:bg-purple-600 transition-colors">
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center text-center -mt-16 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Build something Lovable</h1>
          <p className="mt-4 text-lg md:text-xl text-zinc-300 max-w-xl">
            Create apps and websites by chatting with AI
          </p>
        </main>

        <footer className="w-full max-w-3xl mx-auto pb-4">
          <form onSubmit={handleSubmit} className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-700 rounded-3xl p-3 flex flex-col gap-3 shadow-2xl">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Ask Lovable to create a web app that..."
              className="w-full bg-transparent focus:outline-none text-white placeholder-zinc-400 text-lg resize-none px-2 pt-2"
              rows={2}
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                <button type="button" className="p-2 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                  <PlusIcon className="w-5 h-5" />
                </button>
                 <button type="button" className="p-2 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                  <PaperclipIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                  <WaveformIcon className="w-5 h-5" />
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading || !prompt.trim()}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-300 hover:bg-white text-zinc-800 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
                >
                  {isLoading ? <SpinnerIcon className="w-5 h-5"/> : <ArrowUpIcon className="w-5 h-5"/>}
                </button>
              </div>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default App;
