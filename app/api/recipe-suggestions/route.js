import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { item } = await request.json();

    if (!item || !Array.isArray(item)) {
      return new Response(JSON.stringify({ error: 'Invalid items array' }), { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a concise recipe assistant.' },
        { role: 'user', content: `Please suggest four short recipes using these items: ${item.join(', ')}. Be concise and provide only the essential details, including a title, list of ingredients and brief instructions. The response should be a JSON array of objects with the properties: title, ingredients (array), and instructions.` }
      ],
      max_tokens: 500, // Adjust max tokens if needed
    });

    const recipes = response.choices[0].message.content.trim();
    return new Response(JSON.stringify({ recipes }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error generating recipe' }), { status: 500 });
  }
}
