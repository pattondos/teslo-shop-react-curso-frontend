import { tesloApi } from "@/api/tesloApi";
import type { Product } from "@/interfaces/product.interface";
import { sleep } from "@/lib/sleep";

export const createUpdtProductAction = async(
        productLike: Partial<Product> & { files?: File[] }
    ): Promise<Product> => {
        await sleep(1500);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, user, images= [], files= [],...productData } = productLike;

    const isCreating = id === 'new';

    productData.stock = Number(productData.stock || 0);
    productData.price = Number(productData.price || 0);

    if(files.length > 0){
        const newImageNames = await uploadFiles(files);
        images.push(...newImageNames);
    }

    const imagesToSave = images.map(img => {
        if(img.includes('http')) return img.split('/').pop() || '';
        return img;
    });

    const { data } = await tesloApi<Product>({
        url: isCreating ? '/products' : `/products/${id}`,
        method: isCreating ? 'POST' : 'PATCH',
        data: {
            ...productData, 
            images: imagesToSave
        },
    });

    return{
        ...data,
        images: data.images.map(img => {
            if(img.includes('http')) return img;
            return `${import.meta.env.VITE_API_URL}/files/product/${img}`
        }),
    };
}


interface FileUploadResponse{
    secureUrl: string;
    fileName: string;
}

const uploadFiles = async( files: File[]) =>{

    const uploadPromises= files.map( async file => {

        const formData = new FormData();
        formData.append('file', file);

        const {data} =await tesloApi<FileUploadResponse>({
            url: '/files/product',
            method: 'POST',
            data: formData
        });

        return data.fileName;
    });

    const uploadedFileNames = await Promise.all(uploadPromises);
    return uploadedFileNames;
}