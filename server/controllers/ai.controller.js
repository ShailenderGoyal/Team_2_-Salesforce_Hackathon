import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SIMPLIFIED_SYSTEM_PROMPT = `You are a credit parameter analysis expert. Your role is to analyze individual credit scores and provide encouraging, actionable insights.

For each parameter, you must return ONLY a valid JSON array with this exact structure:
[
  {
    "parameter_name": "parameter_name",
    "current_situation": number_between_1_and_5,
    "remark": "encouraging and actionable remark"
  }
]

Scoring Framework for current_situation:
- Score 80-100: current_situation = 5, remark should be "Excellent performance, maintain and leverage this strength."
- Score 60-79: current_situation = 4, remark should be "Good performance, minor optimizations needed."
- Score 40-59: current_situation = 3, remark should be "Fair performance, focused improvement required."
- Score 20-39: current_situation = 2, remark should be "Needs attention, significant improvement needed."
- Score 0-19: current_situation = 1, remark should be "Critical area, immediate action required."

Always be encouraging, specific, and actionable. Focus on what users can control and improve.
Return ONLY the JSON array, no additional text or formatting.`;

// Helper functions to map scores
const mapScoreToScale = (score) => {
    if (score >= 80) return 5;
    if (score >= 60) return 4;
    if (score >= 40) return 3;
    if (score >= 20) return 2;
    return 1;
};

const generateRemark = (score) => {
    if (score >= 80) return "Excellent performance, maintain and leverage this strength.";
    if (score >= 60) return "Good performance, minor optimizations needed.";
    if (score >= 40) return "Fair performance, focused improvement required.";
    if (score >= 20) return "Needs attention, significant improvement needed.";
    return "Critical area, immediate action required.";
};

// Generate summary of all remarks/actions
const generateActionSummary = async (analysisResult) => {
    try {
        const remarksText = analysisResult.map(item => 
            `${item.parameter_name}: ${item.remark}`
        ).join('\n');

        const summaryPrompt = `Based on these credit parameter remarks, create a concise action summary in bullet points:

${remarksText}

Provide a brief summary of key actions the user should take, focusing on the most impactful improvements. Keep it under 100 words with bullet points.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4.1',
            messages: [
                {
                    role: "system",
                    content: "You are a financial advisor. Summarize the key actions from credit parameter analysis into concise bullet points."
                },
                {
                    role: "user",
                    content: summaryPrompt
                }
            ],
            temperature: 0.7,
            // max_tokens: 200,
        });

        return response.choices[0].message.content;

    } catch (error) {
        console.error('Error generating action summary:', error);
        
        // Fallback: Generate simple summary
        const criticalParams = analysisResult.filter(a => a.current_situation <= 2);
        const fairParams = analysisResult.filter(a => a.current_situation === 3);
        
        let fallbackSummary = "**Key Actions:**\n";
        
        if (criticalParams.length > 0) {
            fallbackSummary += `• **Priority**: Focus on ${criticalParams.map(p => p.parameter_name.replace(/_/g, ' ')).join(', ')}\n`;
        }
        
        if (fairParams.length > 0) {
            fallbackSummary += `• **Improve**: Work on ${fairParams.map(p => p.parameter_name.replace(/_/g, ' ')).join(', ')}\n`;
        }
        
        fallbackSummary += "• **Maintain**: Continue strong performance in excellent parameters";
        
        return fallbackSummary;
    }
};

export const analyzeParameterSimple = async (req, res) => {
    try {
        const { parameters } = req.body; // Array of {name, score, description}
        
        const analysisPrompt = `Analyze these credit parameters and return JSON:
${parameters.map(p => `- ${p.name}: ${p.score}/100 ${p.description ? `(${p.description})` : ''}`).join('\n')}

Return the analysis as a JSON array with parameter_name, current_situation (1-5), and remark for each parameter.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4.1',
            messages: [
                { role: "system", content: SIMPLIFIED_SYSTEM_PROMPT },
                { role: "user", content: analysisPrompt }
            ],
            temperature: 0.7,
            max_tokens: 1200,
        });

        let analysisResult;
        try {
            // Try to parse the AI response as JSON
            analysisResult = JSON.parse(response.choices[0].message.content);
        } catch (parseError) {
            // Fallback: Generate the JSON structure manually if AI doesn't return valid JSON
            console.warn('AI response was not valid JSON, generating fallback structure');
            analysisResult = parameters.map(param => ({
                parameter_name: param.name,
                current_situation: mapScoreToScale(param.score),
                remark: generateRemark(param.score)
            }));
        }

        // Generate action summary from the remarks
        const actionSummary = await generateActionSummary(analysisResult);

        res.status(200).json({ 
            analysis: analysisResult,
            action_summary: actionSummary
        });

    } catch (error) {
        console.error('Error analyzing parameters:', error);
        res.status(500).json({ error: 'Failed to analyze parameters.' });
    }
};
