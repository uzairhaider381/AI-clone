import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    let dataUrl = "";
    if (typeof image === 'string') {
        dataUrl = image;
    } else {
        const arrayBuffer = await (image as Blob).arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        dataUrl = `data:${(image as Blob).type};base64,${base64}`;
    }

    const apiKey = process.env.GROQ_API_KEY;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.2-11b-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this image in detail. Your response MUST be valid JSON with the exactly following keys: "description" (a very detailed paragraph describing what type of object it is, its properties, the scene, the context), "ocr" (any text visible in the image, or empty string if none), "confidence" (a decimal number between 0.8 and 1.0), and "labels" (an array of 5-8 descriptive keyword strings).' },
              { type: 'image_url', image_url: { url: dataUrl } }
            ]
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      })
    });

    if (!response.ok) {
        throw new Error('Groq Vision API failed');
    }

    const data = await response.json();
    const resultJson = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({
      description: resultJson.description || "Detailed analysis complete.",
      ocr: resultJson.ocr || "No text detected.",
      confidence: resultJson.confidence || 0.95,
      labels: resultJson.labels || ["vision", "analysis"]
    });
  } catch (error) {
    console.error('Vision API error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
