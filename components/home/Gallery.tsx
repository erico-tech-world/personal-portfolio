import { createClient } from '@/lib/supabase/server';
import { GalleryItem } from '@/types/index';
import GallerySlider from './GallerySlider';
import Section from '@/components/shared/Section';

// This is a server component that fetches data and passes it to the client component.
async function Gallery() {
    const supabase = createClient();
    let galleryItems: GalleryItem[] | null = null;
    let error: any = null;

    try {
        const result = await supabase
            .from('gallery_items')
            .select('*')
            .order('id', { ascending: true });
        
        galleryItems = result.data;
        error = result.error;

    } catch (e) {
        error = e;
    }

    if (error || !galleryItems || galleryItems.length === 0) {
        if(error) console.error('Error fetching gallery items:', error);
        // Fallback to static data if Supabase fetch fails or returns no items
        galleryItems = [
          { id: 1, imageUrl: 'https://picsum.photos/seed/patever1/300/300', category: 'Branding', publicId: '', title: 'Project 1', description: 'Description for project 1', project_url: '#' },
          { id: 2, imageUrl: 'https://picsum.photos/seed/patever2/300/300', category: 'Branding', publicId: '', title: 'Project 2', description: 'Description for project 2', project_url: '#' },
          { id: 3, imageUrl: 'https://picsum.photos/seed/patever3/300/300', category: 'UI/UX', publicId: '', title: 'Project 3', description: 'Description for project 3', project_url: '#' },
          { id: 4, imageUrl: 'https://picsum.photos/seed/wearethebest/300/300', category: 'Branding', publicId: '', title: 'Project 4', description: 'Description for project 4', project_url: '#' },
          { id: 5, imageUrl: 'https://picsum.photos/seed/freshfruits/300/300', category: 'Packaging', publicId: '', title: 'Project 5', description: 'Description for project 5', project_url: '#' },
          { id: 6, imageUrl: 'https://picsum.photos/seed/goodenvironment/300/300', category: 'Social', publicId: '', title: 'Project 6', description: 'Description for project 6', project_url: '#' },
          { id: 7, imageUrl: 'https://picsum.photos/seed/innovate/300/300', category: 'Social', publicId: '', title: 'Project 7', description: 'Description for project 7', project_url: '#' },
          { id: 8, imageUrl: 'https://picsum.photos/seed/jump/300/300', category: 'Photography', publicId: '', title: 'Project 8', description: 'Description for project 8', project_url: '#' },
          { id: 9, imageUrl: 'https://picsum.photos/seed/patever4/300/300', category: 'Branding', publicId: '', title: 'Project 9', description: 'Description for project 9', project_url: '#' },
          { id: 10, imageUrl: 'https://picsum.photos/seed/patever5/300/300', category: 'Branding', publicId: '', title: 'Project 10', description: 'Description for project 10', project_url: '#' },
          { id: 11, imageUrl: 'https://picsum.photos/seed/patever6/300/300', category: 'UI/UX', publicId: '', title: 'Project 11', description: 'Description for project 11', project_url: '#' },
          { id: 12, imageUrl: 'https://picsum.photos/seed/wearethebest2/300/300', category: 'Branding', publicId: '', title: 'Project 12', description: 'Description for project 12', project_url: '#' },
          { id: 13, imageUrl: 'https://picsum.photos/seed/freshfruits2/300/300', category: 'Packaging', publicId: '', title: 'Project 13', description: 'Description for project 13', project_url: '#' },
          { id: 14, imageUrl: 'https://picsum.photos/seed/goodenvironment2/300/300', category: 'Social', publicId: '', title: 'Project 14', description: 'Description for project 14', project_url: '#' },
          { id: 15, imageUrl: 'https://picsum.photos/seed/innovate2/300/300', category: 'Social', publicId: '', title: 'Project 15', description: 'Description for project 15', project_url: '#' },
          { id: 16, imageUrl: 'https://picsum.photos/seed/jump2/300/300', category: 'Photography', publicId: '', title: 'Project 16', description: 'Description for project 16', project_url: '#' },
          { id: 17, imageUrl: 'https://picsum.photos/seed/patever7/300/300', category: 'Branding', publicId: '', title: 'Project 17', description: 'Description for project 17', project_url: '#' },
          { id: 18, imageUrl: 'https://picsum.photos/seed/patever8/300/300', category: 'Branding', publicId: '', title: 'Project 18', description: 'Description for project 18', project_url: '#' },
          { id: 19, imageUrl: 'https://picsum.photos/seed/patever9/300/300', category: 'UI/UX', publicId: '', title: 'Project 19', description: 'Description for project 19', project_url: '#' },
          { id: 20, imageUrl: 'https://picsum.photos/seed/wearethebest3/300/300', category: 'Branding', publicId: '', title: 'Project 20', description: 'Description for project 20', project_url: '#' },
        ];
    }

    return <GallerySlider items={galleryItems} />;
}

export default Gallery;
