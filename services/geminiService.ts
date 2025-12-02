

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

const fileToPart = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
    const { mimeType, data } = dataUrlToParts(dataUrl);
    return { inlineData: { mimeType, data } };
};

const dataUrlToParts = (dataUrl: string) => {
    const arr = dataUrl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");
    return { mimeType: mimeMatch[1], data: arr[1] };
}

const dataUrlToPart = (dataUrl: string) => {
    const { mimeType, data } = dataUrlToParts(dataUrl);
    return { inlineData: { mimeType, data } };
}

const handleApiResponse = (response: GenerateContentResponse): string => {
    if (response.promptFeedback?.blockReason) {
        const { blockReason, blockReasonMessage } = response.promptFeedback;
        const errorMessage = `Request was blocked. Reason: ${blockReason}. ${blockReasonMessage || ''}`;
        throw new Error(errorMessage);
    }

    // Find the first image part in any candidate
    for (const candidate of response.candidates ?? []) {
        const imagePart = candidate.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData) {
            const { mimeType, data } = imagePart.inlineData;
            return `data:${mimeType};base64,${data}`;
        }
    }

    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        const errorMessage = `Image generation stopped unexpectedly. Reason: ${finishReason}. This often relates to safety settings.`;
        throw new Error(errorMessage);
    }
    const textFeedback = response.text?.trim();
    const errorMessage = `The AI model did not return an image. ` + (textFeedback ? `The model responded with text: "${textFeedback}"` : "This can happen due to safety filters or if the request is too complex. Please try a different image.");
    throw new Error(errorMessage);
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash-image';

export type GenerationMode = 'Personal' | 'Couple' | 'Family' | 'Jomblo';

export const generateModelImage = async (userImage: File, mode: GenerationMode = 'Family'): Promise<string> => {
    const userImagePart = await fileToPart(userImage);
    
    let prompt = "";
    
    if (mode === 'Personal') {
        prompt = `You are an expert fashion photographer AI. Transform the person in this image into a full-body fashion model photo suitable for an e-commerce website. The background must be a clean, neutral studio backdrop (light gray, #f0f0f0). The person should have a neutral, professional model expression. Preserve the person's identity, unique features, and body type, but place them in a standard, relaxed standing model pose. The final image must be photorealistic. Return ONLY the final image.`;
    } else if (mode === 'Couple') {
        prompt = `You are an expert portrait photographer AI. Transform the couple in this image into a high-quality professional studio photo. 
        **Instructions:**
        1. **Background:** Clean, neutral studio backdrop (light gray, #f0f0f0).
        2. **Subjects:** Preserve the identity, facial features, and body types of BOTH individuals.
        3. **Interaction:** Keep the connection and relative positioning of the couple natural and affectionate if applicable.
        4. **Style:** Photorealistic, high-end studio quality.
        5. **Output:** Return ONLY the final image.`;
    } else if (mode === 'Jomblo') {
        prompt = `You are an expert creative photographer AI. The user provides a photo of a single person. Your task is to generate a photo of this person with an imaginary, attractive 'dream partner' (dreammate).
        **Instructions:**
        1.  **Subject:** Preserve the identity and appearance of the uploaded person.
        2.  **Dreammate:** Generate a realistic, attractive partner standing next to or interacting with the user (e.g., holding hands, leaning on shoulder, standing close). The partner should match the lighting and style of the user.
        3.  **Context:** The scene should look like a happy couple photo in a studio setting.
        4.  **Style:** Photorealistic, high-quality.
        5.  **Background:** Clean, neutral studio backdrop.
        6.  **Output:** Return ONLY the final image.`;
    } else {
        // Family
        prompt = `You are an expert family photographer AI. Transform the family group in this image into a professional studio family portrait.
        **Instructions:**
        1. **Background:** Clean, neutral studio backdrop (light gray, #f0f0f0).
        2. **Subjects:** Strictly preserve the identities, faces, ages, and body types of ALL family members in the photo.
        3. **Composition:** Create a cohesive, balanced group composition suitable for a family album.
        4. **Style:** Warm, professional, photorealistic studio lighting.
        5. **Output:** Return ONLY the final image.`;
    }

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [userImagePart, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    return handleApiResponse(response);
};

export const generateVirtualTryOnImage = async (modelImageUrl: string, garmentImage: File, garmentCategory: string = 'Tops'): Promise<string> => {
    const modelImagePart = dataUrlToPart(modelImageUrl);
    const garmentImagePart = await fileToPart(garmentImage);
    
    let prompt = "";
    
    if (garmentCategory === 'Accessories') {
        prompt = `You are an expert virtual stylist. The user wants to add an accessory to the person in the image.
        
        **Instructions:**
        1. **Add the Accessory:** Realisticially place the accessory from the 'garment image' onto the person in the 'model image' (e.g., hat on head, scarf around neck, sunglasses on face, bag on shoulder/in hand). If there are multiple people, apply it to the main subject or the most logical person.
        2. **Preserve Outfit:** DO NOT remove the person's existing clothing. The accessory should be worn WITH the current outfit.
        3. **Integration:** Ensure the accessory blends naturally with the lighting, shadows, and perspective of the original image.
        4. **Identity:** Completely preserve the person's face, hair (unless covered by hat), and body features.
        5. **Output:** Return ONLY the final image with the accessory added.`;
    } else if (garmentCategory === 'Outerwear') {
        prompt = `You are an expert virtual stylist. The user wants to layer outerwear onto the person.
        
        **Instructions:**
        1. **Layer Over:** Place the outerwear from the 'garment image' OVER the person's current outfit.
        2. **Preserve Context:** Visible parts of the underlying outfit (e.g. shirt collar, hem, pants) should remain visible where appropriate. Do not arbitrarily remove bottoms.
        3. **Realism:** Ensure realistic fabric folds, fit, and shadows.
        4. **Output:** Return ONLY the final image.`;
    } else if (garmentCategory === 'Traditional') {
        prompt = `You are an expert cultural stylist. The user wants to see the person wearing this traditional Indonesian attire (Pakaian Adat).
        
        **Instructions:**
        1. **Full Transformation:** Replace the person's current outfit completely with the traditional attire shown in the 'garment image'.
        2. **Cultural Details:** Pay close attention to intricate patterns, jewelry, headpieces, and fabrics unique to this traditional dress. Preserve these details faithfully.
        3. **Fit & Drape:** Ensure the clothing fits the person's body naturally, respecting how traditional fabric drapes.
        4. **Identity:** Preserve the person's face and body shape.
        5. **Output:** Return ONLY the final image.`;
    } else if (garmentCategory === 'Swimwear') {
        prompt = `You are an expert swimwear stylist. The user wants to see the person wearing this specific swimwear/bikini.
        
        **Instructions:**
        1. **Outfit Replacement:** Replace the person's current outfit completely with the swimwear shown in the 'garment image'.
        2. **Fit & Anatomy:** Ensure the swimwear fits the person's body naturally. Maintain accurate body anatomy and skin tone for exposed areas, blending them seamlessly with the face and limbs.
        3. **Respectful Realism:** The image must be tasteful, photorealistic, and suitable for a fashion catalog.
        4. **Identity:** Strictly preserve the person's face, hair, and overall body structure.
        5. **Output:** Return ONLY the final image.`;
    } else {
        // Default replacement logic for Tops, Bottoms, Dresses, etc.
         prompt = `You are an expert virtual try-on AI. You will be given a 'model image' and a 'garment image'. Your task is to create a new photorealistic image where the subject(s) from the 'model image' is wearing the clothing from the 'garment image'.

        **Crucial Rules:**
        1.  **Garment Swap:** Identify the type of garment (Top, Bottom, Dress) and replace ONLY the corresponding item on the subject.
        2.  **Preserve the Model:** The people's faces, hair, body shapes, and poses from the 'model image' MUST remain unchanged.
        3.  **Preserve the Background:** The entire background from the 'model image' MUST be preserved perfectly.
        4.  **Apply the Garment:** Realistically fit the new garment onto the person. It should adapt to their pose with natural folds, shadows, and lighting consistent with the original scene.
        5.  **Output:** Return ONLY the final, edited image. Do not include any text.`;
    }

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [modelImagePart, garmentImagePart, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    return handleApiResponse(response);
};

export const generatePoseVariation = async (tryOnImageUrl: string, poseInstruction: string): Promise<string> => {
    const tryOnImagePart = dataUrlToPart(tryOnImageUrl);
    const prompt = `You are an expert fashion photographer AI. Take this image and regenerate it from a different perspective. The person, clothing, and background style must remain identical. The new perspective should be: "${poseInstruction}". Return ONLY the final image.`;
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [tryOnImagePart, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    return handleApiResponse(response);
};

export const generatePoseFromReference = async (modelImageUrl: string, referencePoseImage: File): Promise<string> => {
    const modelImagePart = dataUrlToPart(modelImageUrl);
    const referencePosePart = await fileToPart(referencePoseImage);

    const prompt = `You are an expert fashion photographer AI.
    **Task:** Regenerate the 'model image' so the subject adopts the exact pose of the person in the 'reference pose image'.
    **Instructions:**
    1. **Pose Matching:** Analyze the body language, limb positioning, and head angle of the 'reference pose image' and apply it to the subject in the 'model image'.
    2. **Preserve Identity:** The subject's face, hair, and body type MUST remain identical to the 'model image'.
    3. **Preserve Clothing:** The subject must wear the exact same outfit as in the 'model image'.
    4. **Background:** Keep the background consistent with the 'model image'.
    5. **Output:** Return ONLY the final image.`;

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [modelImagePart, referencePosePart, { text: prompt }] },
         config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    return handleApiResponse(response);
}

export const generateGarmentColorway = async (garmentImageUrl: string, color: string): Promise<string> => {
    const garmentImagePart = dataUrlToPart(garmentImageUrl);
    const prompt = `You are an expert fashion designer AI.
    **Task:** Change the color of this garment item to ${color}.
    **Instructions:**
    1. **Color Change:** Apply the color '${color}' to the fabric of the garment.
    2. **Preserve Texture:** Keep all original fabric textures, folds, shading, and material properties.
    3. **Preserve Shape:** The shape and outline of the garment must remain exactly the same.
    4. **Background:** Keep the background transparent or neutral white/gray as in the original.
    5. **Output:** Return ONLY the final image of the garment.`;

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [garmentImagePart, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    return handleApiResponse(response);
};