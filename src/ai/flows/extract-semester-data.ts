
'use server';

/**
 * @fileOverview Analyzes text or an image of a grade certificate to extract structured semester data.
 *
 * - `extractSemesterData` - A function that takes text or an image and returns extracted subject details.
 * - `ExtractSemesterDataInput` - The input type for the `extractSemesterData` function.
 * - `ExtractSemesterDataOutput` - The return type for the `extractSemesterData` function.
 * - `ExtractedSubject` - The type for a single extracted subject.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractSemesterDataInputSchema = z.object({
  text: z.string().optional().describe('The raw text containing semester results.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of a grade certificate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type ExtractSemesterDataInput = z.infer<typeof ExtractSemesterDataInputSchema>;

const ExtractedSubjectSchema = z.object({
  name: z.string().describe('The name of the subject or course.'),
  credits: z.number().describe('The number of credits for the subject.'),
  marks: z
    .number()
    .optional()
    .describe(
      'The marks obtained out of 100. Should be present if status is PASS.'
    ),
  status: z
    .enum(['PASS', 'RA', 'AAA', 'W', 'ABS'])
    .describe(
      'The final status of the subject. RA: Re-appear, AAA: Absent, W: Withdrawn, ABS: Absent.'
    ),
});

export type ExtractedSubject = z.infer<typeof ExtractedSubjectSchema>;

// The schema for a successful response.
const SuccessResponseSchema = z.object({
  subjects: z
    .array(ExtractedSubjectSchema)
    .describe('An array of all subjects extracted from the input.'),
  error: z.undefined().optional(),
});

// The schema for a failure response.
const ErrorResponseSchema = z.object({
    subjects: z.undefined().optional(),
    error: z.string().describe('A descriptive error message explaining why the operation failed.'),
});

// The combined output schema that can be either a success or an error.
const ExtractSemesterDataOutputSchema = z.union([SuccessResponseSchema, ErrorResponseSchema]);
export type ExtractSemesterDataOutput = z.infer<
  typeof ExtractSemesterDataOutputSchema
>;

export async function extractSemesterData(
  input: ExtractSemesterDataInput
): Promise<ExtractSemesterDataOutput> {
  return extractSemesterDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSemesterDataPrompt',
  input: { schema: ExtractSemesterDataInputSchema },
  // The output schema for the AI model itself is just the subjects.
  // We will wrap this in our success/error object in the flow.
  output: { schema: z.object({ subjects: z.array(ExtractedSubjectSchema) }) },
  prompt: `You are an expert at analyzing academic transcripts. Extract subject information from the provided text or image.

For each subject, extract the following:
1.  **name**: The full name of the subject.
2.  **credits**: The credit value.
3.  **marks**: The numerical marks (out of 100). This can be omitted if not present.
4.  **status**: The final status. Must be one of 'PASS', 'RA' (Re-appear), 'AAA' (Absent), 'W' (Withdrawn), or 'ABS' (Absent). If marks are below 50, the status should be 'RA'. If the subject is passed but no marks are given, the status is 'PASS'.

Analyze the provided data:
{{#if text}}
---
{{{text}}}
---
{{/if}}

{{#if photoDataUri}}
{{media url=photoDataUri}}
{{/if}}

Return the extracted subjects in the specified JSON format. If no subjects can be found, return an empty array.
`,
});

const extractSemesterDataFlow = ai.defineFlow(
  {
    name: 'extractSemesterDataFlow',
    inputSchema: ExtractSemesterDataInputSchema,
    outputSchema: ExtractSemesterDataOutputSchema,
  },
  async (input): Promise<ExtractSemesterDataOutput> => {
    if (!input.text && !input.photoDataUri) {
      return { error: 'Either text or an image must be provided.' };
    }
    
    try {
      const { output } = await prompt(input);

      // If the AI model fails or returns an invalid structure, the output will be null.
      if (!output || !output.subjects) {
         return { error: 'The AI model could not understand the provided data. Please check your input and try again.' };
      }
      
      // On success, return the structured success object.
      return { subjects: output.subjects };

    } catch (e: any) {
      // This catches lower-level errors (network, model safety filters, etc.)
      console.error(`[extractSemesterDataFlow] Critical error during AI prompt execution: ${e.message}`);
      return { error: 'An internal error occurred while analyzing the data. This could be due to an invalid image format or a temporary service issue. Please try again later.' };
    }
  }
);
