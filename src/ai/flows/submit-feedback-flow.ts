'use server';
/**
 * @fileOverview A flow for processing and acknowledging user feedback.
 *
 * - `submitFeedback` - The main function to handle feedback submission.
 * - `FeedbackInput` - The Zod schema for the feedback input.
 * - `FeedbackOutput` - The Zod schema for the feedback submission result.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FeedbackInputSchema = z.object({
  type: z.enum(['bug', 'feature', 'general']).describe('The type of feedback being submitted.'),
  message: z.string().describe('The user-provided feedback message.'),
  userId: z.string().describe('The ID of the user submitting the feedback.'),
  userEmail: z.string().describe('The email of the user submitting the feedback.'),
});
export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

const FeedbackOutputSchema = z.object({
  confirmation: z.string().describe('A friendly confirmation message to be shown to the user.'),
});
export type FeedbackOutput = z.infer<typeof FeedbackOutputSchema>;

export async function submitFeedback(input: FeedbackInput): Promise<FeedbackOutput> {
  return submitFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'feedbackAcknowledgementPrompt',
  input: { schema: FeedbackInputSchema },
  output: { schema: FeedbackOutputSchema },
  prompt: `A user has just submitted feedback for the yourgrade.io application.
  
Your task is to generate a brief, friendly, and appreciative confirmation message. The tone should be professional but warm.

- Acknowledge the type of feedback they provided.
- Thank them for taking the time to help improve the platform.
- Do NOT ask them for more information or promise any specific action.

Here is the user's submission:
- User ID: {{{userId}}}
- User Email: {{{userEmail}}}
- Feedback Type: {{{type}}}
- Message: {{{message}}}

Generate only the confirmation message.
`,
});

const submitFeedbackFlow = ai.defineFlow(
  {
    name: 'submitFeedbackFlow',
    inputSchema: FeedbackInputSchema,
    outputSchema: FeedbackOutputSchema,
  },
  async (input) => {
    // In a real-world scenario, you would add logic here to save the feedback
    // to a Firestore collection, a logging service, or send an email notification.
    // For now, we will just use the AI to generate a confirmation.

    console.log('Received feedback:', input);

    const { output } = await prompt(input);
    
    // If the model fails to generate, provide a fallback confirmation.
    if (!output) {
      return { confirmation: "Thank you for your feedback! We've received it and appreciate you helping us improve." };
    }

    return output;
  }
);
