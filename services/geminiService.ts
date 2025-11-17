
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using mock data.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const schema = {
  type: Type.OBJECT,
  properties: {
    html: {
      type: Type.STRING,
      description: "The complete HTML code for the website, including the Tailwind CSS CDN script. All styling must be done with Tailwind classes in the HTML. Do not use <style> tags."
    }
  },
  required: ['html']
};

export const generateWebsite = async (prompt: string): Promise<string> => {
  if (!ai) {
    // Mock response for development without API key
    return new Promise(resolve => setTimeout(() => resolve(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mock Website</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 text-gray-800">
        <div class="container mx-auto p-8">
          <h1 class="text-4xl font-bold mb-4">Mock Website</h1>
          <p class="text-lg">This is a mock response because the Gemini API key is not configured.</p>
          <p class="mt-4">Your prompt was: "${prompt}"</p>
        </div>
      </body>
      </html>`), 1500));
  }

  const systemInstruction = `You are an expert web developer specializing in creating beautiful, single-page websites using HTML and Tailwind CSS. The user will provide a description of a website. Your task is to generate a single, complete HTML file that implements the described website.

  RULES:
  1.  The HTML must include the Tailwind CSS CDN script in the <head> section: <script src="https://cdn.tailwindcss.com"></script>.
  2.  All styling must be done using Tailwind classes directly in the HTML elements.
  3.  Do NOT use any custom CSS, <style> tags, or external CSS files.
  4.  The output must be a JSON object with a single key 'html' containing the full HTML content as a string.
  5.  Use placeholder images from picsum.photos if images are needed (e.g., https://picsum.photos/800/600).
  6.  Create a visually appealing, modern, and fully functional single-page layout.
  7.  Ensure the website is responsive across different screen sizes.
  8.  Make the content relevant to the user's prompt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);
    
    if (parsed && typeof parsed.html === 'string') {
      return parsed.html;
    } else {
      throw new Error("Invalid JSON response format from API.");
    }
  } catch (error) {
    console.error("Error generating website:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Error</title>
          <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-red-100 flex items-center justify-center h-screen">
          <div class="text-center p-8 bg-white rounded-lg shadow-md">
              <h1 class="text-2xl font-bold text-red-600">Error Generating Website</h1>
              <p class="mt-2 text-gray-700">The AI failed to generate the website preview.</p>
              <pre class="mt-4 text-left bg-gray-100 p-4 rounded text-sm text-red-700 overflow-auto">${errorMessage}</pre>
          </div>
      </body>
      </html>`;
  }
};
