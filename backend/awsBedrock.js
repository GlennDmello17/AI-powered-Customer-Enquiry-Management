import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import dotenv from "dotenv";

dotenv.config();

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Extract JSON safely from Titan output
function extractJSON(text) {
  if (!text) return null;

  // Remove any triple backticks and language hints
  let cleaned = text.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim();

  // Extract the first JSON object in the text
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) return null;

  const jsonText = cleaned.slice(firstBrace, lastBrace + 1);

  try {
    const parsed = JSON.parse(jsonText);

    // Handle tabular-data-json format
    if (parsed.rows && parsed.rows.length > 0) {
      const row = parsed.rows[0];
      return {
        category: row.Category?.toLowerCase() || "general",
        priority: row.Priority?.toLowerCase() || "medium",
      };
    }

    // Normal JSON format
    return {
      category: parsed.category?.toLowerCase() || "general",
      priority: parsed.priority?.toLowerCase() || "medium",
    };
  } catch (err) {
    console.warn("Failed to parse JSON from Titan output:", jsonText);
    return null;
  }
}


export async function categorizeEnquiry(enquiryText) {
  try {
    const prompt = `
Categorize the following customer enquiry into JSON format:
{
  "category": "sales | support | billing | general",
  "priority": "urgent | medium | low"
}

Enquiry: "${enquiryText}"
Respond ONLY with JSON.
`;

    const command = new InvokeModelCommand({
      modelId: "amazon.titan-text-express-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({ inputText: prompt }),
    });

    const response = await client.send(command);

    const data = Buffer.from(response.body).toString("utf-8");

    const parsed = JSON.parse(data);
    const outputText = parsed?.results?.[0]?.outputText || "{}";

    const result = extractJSON(outputText);

    return {
      category: result?.category || "general",
      priority: result?.priority || "medium",
    };
  } catch (err) {
    console.error("Bedrock Error:", err);
    return {
      category: "general",
      priority: "medium",
    };
  }
}


