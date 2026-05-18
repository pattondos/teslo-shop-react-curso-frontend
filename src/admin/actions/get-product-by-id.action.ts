import { tesloApi } from "@/api/tesloApi";
import type { Product } from "@/interfaces/product.interface";

export const getProductByID = async(id: string):Promise<Product> => {
    if(!id) throw new Error('ID ir required');

    if(id === 'new'){
        return{
            id: 'new',
            title: '',
            price: 0,
            description: '',
            slug: '',
            stock: 0,
            sizes: [],
            gender: 'men',
            tags: [],
            images: [],
        } as unknown as Product;
    }

    const { data } = await tesloApi.get<Product>(`/products/${id}`);

    const images = data.images.map(img =>{
        if( img.includes('http') ) return img;
        return `${import.meta.env.VITE_API_URL}/files/product/${img}`
    });

    return{
        ...data,
        images,
    }
}