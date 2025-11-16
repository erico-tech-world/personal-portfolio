'use server';

import { createClient } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
// FIX: Corrected import path to be more explicit for module resolution.
import { GalleryItem } from "@/types/index";

interface ActionResult {
    success: boolean;
    error?: string;
    newItem?: GalleryItem;
    updatedItem?: GalleryItem;
}

// Helper to upload buffer to Cloudinary
async function uploadToCloudinary(buffer: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "portfolio-gallery" },
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
}


export async function addGalleryItem(formData: FormData): Promise<ActionResult> {
    const file = formData.get('image') as File;
    const category = formData.get('category') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const project_url = formData.get('project_url') as string;

    if (!file || !category) {
        return { success: false, error: "Image and category are required." };
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await uploadToCloudinary(buffer);
        
        const newItemData = {
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            category: category,
            title: title,
            description: description,
            project_url: project_url,
        };

        const supabase = createClient();
        const { data, error } = await supabase
            .from('gallery_items')
            .insert(newItemData)
            .select()
            .single();

        if (error) {
            // If Supabase fails, try to delete the uploaded image from Cloudinary
            await cloudinary.uploader.destroy(uploadResult.public_id);
            throw new Error(error.message);
        }

        revalidatePath('/admin-panel');
        revalidatePath('/');
        return { success: true, newItem: data as GalleryItem };

    } catch (e: any) {
        return { success: false, error: `Failed to add item: ${e.message}` };
    }
}

export async function updateGalleryItem(formData: FormData): Promise<ActionResult> {
    const id = Number(formData.get('id'));
    const category = formData.get('category') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const project_url = formData.get('project_url') as string;

    if (!id) {
        return { success: false, error: "ID is required." };
    }
    
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('gallery_items')
            .update({ category, title, description, project_url })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        revalidatePath('/admin-panel');
        revalidatePath('/');
        return { success: true, updatedItem: data as GalleryItem };

    } catch (e: any) {
        return { success: false, error: `Failed to update item: ${e.message}` };
    }
}


export async function deleteGalleryItem(id: number, publicId: string): Promise<ActionResult> {
     if (!id || !publicId) {
        return { success: false, error: "ID and Public ID are required." };
    }
    
    try {
        // 1. Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // 2. Delete from Supabase
        const supabase = createClient();
        const { error } = await supabase
            .from('gallery_items')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);

        revalidatePath('/admin-panel');
        revalidatePath('/');
        return { success: true };

    } catch (e: any) {
        return { success: false, error: `Failed to delete item: ${e.message}` };
    }
}


export async function updateAboutContent(content: string): Promise<ActionResult> {
    if (typeof content !== 'string') {
        return { success: false, error: "Content must be a string." };
    }
    try {
        const supabase = createClient();
        // Use upsert to create the row if it doesn't exist, or update it if it does.
        const { error } = await supabase
            .from('site_content')
            .upsert({ content_key: 'about_me', content_value: content });

        if (error) throw new Error(error.message);

        revalidatePath('/admin-panel');
        revalidatePath('/#about'); // Revalidate the about section
        return { success: true };

    } catch (e: any) {
        return { success: false, error: `Failed to update 'About Me' content: ${e.message}` };
    }
}

export async function updateCv(formData: FormData): Promise<ActionResult> {
    const cvFile = formData.get('cv') as File;
    const previewFile = formData.get('preview') as File;

    if (!cvFile || !previewFile) {
        return { success: false, error: "CV file and preview image are required." };
    }

    try {
        // Upload CV
        const cvBytes = await cvFile.arrayBuffer();
        const cvBuffer = Buffer.from(cvBytes);
        const cvUploadResult = await uploadToCloudinary(cvBuffer);

        // Upload Preview
        const previewBytes = await previewFile.arrayBuffer();
        const previewBuffer = Buffer.from(previewBytes);
        const previewUploadResult = await uploadToCloudinary(previewBuffer);

        const supabase = createClient();
        const { error } = await supabase
            .from('site_content')
            .upsert([
                { content_key: 'cv_url', content_value: cvUploadResult.secure_url },
                { content_key: 'cv_preview_url', content_value: previewUploadResult.secure_url }
            ]);

        if (error) {
            // If Supabase fails, try to delete the uploaded files from Cloudinary
            await cloudinary.uploader.destroy(cvUploadResult.public_id);
            await cloudinary.uploader.destroy(previewUploadResult.public_id);
            throw new Error(error.message);
        }

        revalidatePath('/admin-panel');
        revalidatePath('/#about');
        return { success: true };

    } catch (e: any) {
        return { success: false, error: `Failed to update CV: ${e.message}` };
    }
}



export async function deleteContactMessage(id: number): Promise<ActionResult> {
    if (!id) {
        return { success: false, error: "Message ID is required." };
    }
    try {
        const supabase = createClient();
        const { error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', id);
        
        if (error) throw new Error(error.message);

        revalidatePath('/admin-panel');
        return { success: true };

    } catch (e: any) {
        return { success: false, error: `Failed to delete contact message: ${e.message}` };
    }
}
