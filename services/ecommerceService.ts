
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { WardrobeItem } from "../types";

export interface Product {
    id: string;
    title: string;
    price: string;
    currency: string;
    imageUrl: string;
    url: string;
    store: string;
}

// Mock database of products
const MOCK_PRODUCTS: Product[] = [
    {
        id: 'p1',
        title: 'Essential Cotton T-Shirt',
        price: '150.000',
        currency: 'IDR',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        url: '#',
        store: 'Payungi Store'
    },
    {
        id: 'p2',
        title: 'Classic Denim Jacket',
        price: '450.000',
        currency: 'IDR',
        imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400',
        url: '#',
        store: 'Local Brand'
    },
    {
        id: 'p3',
        title: 'Summer Floral Dress',
        price: '320.000',
        currency: 'IDR',
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
        url: '#',
        store: 'Payungi Boutique'
    },
    {
        id: 'p4',
        title: 'Formal Blazer - Navy',
        price: '899.000',
        currency: 'IDR',
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
        url: '#',
        store: 'Executive Wear'
    },
    {
        id: 'p5',
        title: 'Beige Fedora Hat',
        price: '120.000',
        currency: 'IDR',
        imageUrl: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=400',
        url: '#',
        store: 'Payungi Crafts'
    },
    {
        id: 'p6',
        title: 'Casual White Sneakers',
        price: '550.000',
        currency: 'IDR',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        url: '#',
        store: 'Footwear Co'
    }
];

export const findSimilarItems = async (item: WardrobeItem): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simple mock logic: Return random items mixed with some category matching if possible
    // In a real app, this would call a backend with the item's image embedding or keywords.
    
    // Shuffle and pick 3-4 items
    const shuffled = [...MOCK_PRODUCTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
};
