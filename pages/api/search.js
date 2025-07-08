import { GoogleGenerativeAI } from "@google/generative-ai";

const apikey = "AIzaSyB3Q74etnADQ_qSX3OJtzTnteGh-fd4df8";

export default async function handler(req, res) {
  const { query, model = "gemini-2.0-flash" } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, error: 'Parameter "query" harus diisi' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apikey);
    const selectedModel = genAI.getGenerativeModel({ model });

    const result = await selectedModel.generateContent(query);
    const text = result.response.text();

    const reformatPrompt = `
Ubah teks berikut menjadi format JSON terstruktur yang mencakup:
{
  "title": "",
  "description": "",
  "summary": "",
  "source": "AI Generated"
}

Teks:
${text}
`;

    const reformatted = await selectedModel.generateContent(reformatPrompt);
    const jsonText = reformatted.response.text();

    let parsed;
    try {
      const cleanedJson = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleanedJson);
    } catch (e) {
      parsed = {
        error: "Gagal mengubah hasil menjadi JSON",
        raw: jsonText
      };
    }

    return res.status(200).json({
      success: true,
      model,
      question: query,
      result: parsed
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
