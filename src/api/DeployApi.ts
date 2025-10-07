import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { z } from "zod";

// Zod schema for deploy request
export const deployFormSchema = z.object({
    name: z.string().min(1),
    repoUrl: z.string().url(),
    language: z.string().min(1),
    framework: z.string().min(1),
});

export type DeployFormData = z.infer<typeof deployFormSchema>;

// Zod schema for deploy response (customize as needed)
export const deployResponseSchema = z.object({
    message: z.string(),
    projectId: z.string(),
    language: z.string(),
    framework: z.string(),
    database: z.string().nullable(),
    env: z.array(z.any()),
    url: z.string().url(),
});

export type DeployResponse = z.infer<typeof deployResponseSchema>;

/**
 * Sends a deploy request to the API.
 * @param formData - Deploy form data
 * @returns DeployResponse
 */
export async function deployProject(formData: DeployFormData): Promise<DeployResponse> {
    const parseResult = deployFormSchema.safeParse(formData);
    if (!parseResult.success) {
        throw new Error("Invalid deploy form data");
    }
    try {
        const { data } = await api.post("/deploy", formData);
        const result = deployResponseSchema.safeParse(data);
        if (!result.success) {
            throw new Error("Invalid response from deploy API");
        }
        return result.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Error deploying project");
    }
}