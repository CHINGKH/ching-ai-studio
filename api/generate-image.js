module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, aspectRatio } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: aspectRatio || '1:1',
          outputMimeType: 'image/jpeg'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate image from Gemini API');
    }

    const base64ImageBytes = data.predictions[0].bytesBase64Encoded;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
