
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { WardrobeItem } from './types';

// Default wardrobe items hosted for easy access
export const defaultWardrobe: WardrobeItem[] = [
  // --- INDONESIAN TRADITIONAL ---
  {
    id: 'adat-batik-pria',
    name: 'Kemeja Batik Solo',
    url: 'https://images.unsplash.com/photo-1605908502724-9093a79a1b39?w=400',
    category: 'Traditional',
    style: 'Formal'
  },
  {
    id: 'adat-kebaya-modern',
    name: 'Kebaya Modern Brokat',
    url: 'https://images.unsplash.com/photo-1632219438999-52d147361d9a?w=400',
    category: 'Traditional',
    style: 'Formal'
  },
  {
    id: 'adat-bali-pria',
    name: 'Busana Adat Bali Pria',
    url: 'https://images.unsplash.com/photo-1516766453773-40d348a203f5?w=400',
    category: 'Traditional',
    style: 'Formal'
  },
  {
    id: 'adat-minang',
    name: 'Suntiang Minang',
    url: 'https://images.unsplash.com/photo-1582266254565-188d5786411e?w=400',
    category: 'Traditional',
    style: 'Formal'
  },
  {
    id: 'adat-jawa-couple',
    name: 'Busana Pengantin Jawa',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400',
    category: 'Traditional',
    style: 'Formal'
  },
  
  // --- SUITS / DAILY OPTION ---
  {
    id: 'man-daily-suit',
    name: 'Daily Power Suit',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
    category: 'Suits',
    style: 'Formal'
  },

  // --- EXISTING ITEMS ---
  {
    id: 'adat-1',
    name: 'Baju Adat Nusantara',
    url: 'https://asset-2.tribunnews.com/jogja/foto/bank/images/Baju-adat-indonesia-34.jpg',
    category: 'Traditional',
    style: 'Formal'
  },
  {
    id: 'man-jacket-1',
    name: 'Leather Biker Jacket',
    url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400',
    category: 'Outerwear',
    style: 'Vintage',
    model3dUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb'
  },
  {
    id: 'man-shirt-1',
    name: 'White Oxford Shirt',
    url: 'https://images.unsplash.com/photo-1620012253295-c15cc3fe1d24?w=400',
    category: 'Tops',
    style: 'Formal'
  },
   {
    id: 'man-suit-1',
    name: 'Navy Suit Blazer',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
    category: 'Outerwear',
    style: 'Formal'
  },
  {
    id: 'man-hoodie-1',
    name: 'Streetwear Hoodie',
    url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    category: 'Tops',
    style: 'Streetwear'
  },
  {
    id: 'man-pants-1',
    name: 'Slim Fit Chinos',
    url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
    category: 'Bottoms',
    style: 'Formal'
  },
  {
    id: 'man-denim-jacket',
    name: 'Denim Trucker Jacket',
    url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400',
    category: 'Outerwear',
    style: 'Vintage'
  },
  {
    id: 'man-polo',
    name: 'Classic Polo Shirt',
    url: 'https://images.unsplash.com/photo-1626557981101-aae6f84aa6a8?w=400',
    category: 'Tops',
    style: 'Casual'
  },
  {
    id: 'man-shorts',
    name: 'Summer Chino Shorts',
    url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
    category: 'Bottoms',
    style: 'Casual'
  },
  {
    id: 'man-coat',
    name: 'Wool Overcoat',
    url: 'https://images.unsplash.com/photo-1544923746-87908020c78d?w=400',
    category: 'Outerwear',
    style: 'Formal'
  },
  {
    id: 'man-tshirt-black',
    name: 'Essential Black Tee',
    url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
    category: 'Tops',
    style: 'Casual'
  },
  {
    id: 'acc-hat-1',
    name: 'Beige Fedora',
    url: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=400',
    category: 'Accessories',
    style: 'Vintage'
  },
  {
    id: 'acc-glasses-1',
    name: 'Retro Sunglasses',
    url: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400',
    category: 'Accessories',
    style: 'Instagram Filter'
  },
  {
    id: 'acc-bag-1',
    name: 'Leather Tote',
    url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
    category: 'Accessories',
    style: 'Formal'
  },
   {
    id: 'acc-bag-2',
    name: 'Chic Handbag',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
    category: 'Accessories',
    style: 'Party'
  },
  {
    id: 'acc-hat-2',
    name: 'Summer Sun Hat',
    url: 'https://images.unsplash.com/photo-1598463939622-0a719c63d574?w=400',
    category: 'Accessories',
    style: 'Instagram Filter'
  },
  {
    id: 'acc-hat-3',
    name: 'Streetwear Cap',
    url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
    category: 'Accessories',
    style: 'Streetwear'
  },
  {
    id: 'acc-scarf-1',
    name: 'Winter Scarf',
    url: 'https://plus.unsplash.com/premium_photo-1673356301535-ca87d85c8b2d?w=400',
    category: 'Accessories',
    style: 'Casual'
  },
  {
    id: 'acc-necklace-1',
    name: 'Gold Statement Necklace',
    url: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=400',
    category: 'Accessories',
    style: 'Party'
  },
  {
    id: 'acc-bag-3',
    name: 'Leather Crossbody',
    url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    category: 'Accessories',
    style: 'Casual'
  },
  {
    id: 'acc-sunglasses-2',
    name: 'Aviator Sunglasses',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
    category: 'Accessories',
    style: 'Streetwear'
  },
  {
    id: 'acc-earrings-1',
    name: 'Pearl Drop Earrings',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
    category: 'Accessories',
    style: 'Formal'
  },
   {
    id: 'acc-belt-1',
    name: 'Classic Leather Belt',
    url: 'https://images.unsplash.com/photo-1624223359991-725973b53239?w=400',
    category: 'Accessories',
    style: 'Formal'
  },
  {
    id: 'acc-scarf-2',
    name: 'Silk Pattern Scarf',
    url: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=400',
    category: 'Accessories',
    style: 'Party'
  },
  {
    id: 'blazer-1',
    name: 'Classic Blazer',
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    category: 'Outerwear',
    style: 'Formal'
  },
  {
    id: 'dress-1',
    name: 'Evening Silk Dress',
    url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400',
    category: 'Dresses',
    style: 'Party'
  },
  {
    id: 'sport-set',
    name: 'Active Set',
    url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400',
    category: 'Tops',
    style: 'Sport'
  },
  // --- DRAMATIC STUDIO LIGHTING COLLECTION ---
  {
    id: 'dramatic-1',
    name: 'Dramatic Studio Noir',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    category: 'Outerwear',
    style: 'Formal'
  },
  {
    id: 'dramatic-2',
    name: 'Studio Light Beam',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    category: 'Dresses',
    style: 'Party'
  },
  {
    id: 'dramatic-3',
    name: 'High Contrast Profile',
    url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
    category: 'Tops',
    style: 'Formal'
  },
  {
    id: 'dramatic-4',
    name: 'Shadow Play Portrait',
    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    category: 'Outerwear',
    style: 'Formal'
  },
  {
    id: 'dramatic-5',
    name: 'Rim Light Silhouette',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    category: 'Dresses',
    style: 'Instagram Filter'
  },
  // --- SWIMWEAR COLLECTION ---
  {
    id: 'swim-1',
    name: 'Tropical Breeze Bikini',
    url: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400',
    category: 'Swimwear',
    style: 'Casual'
  },
  {
    id: 'swim-2',
    name: 'Sunset Glow Swimsuit',
    url: 'https://images.unsplash.com/photo-1545959734-718228185d0d?w=400',
    category: 'Swimwear',
    style: 'Party'
  },
  {
    id: 'swim-3',
    name: 'Ocean Blue Set',
    url: 'https://images.unsplash.com/photo-1560769619-373f0249783f?w=400',
    category: 'Swimwear',
    style: 'Sport'
  },
  {
    id: 'swim-4',
    name: 'Golden Hour Bikini',
    url: 'https://images.unsplash.com/photo-1582639510494-c80b5de9f548?w=400',
    category: 'Swimwear',
    style: 'Casual'
  },
  {
    id: 'swim-5',
    name: 'Classic Black Bikini',
    url: 'https://images.unsplash.com/photo-1566421528400-9831b1473d09?w=400',
    category: 'Swimwear',
    style: 'Formal'
  },
  {
    id: 'swim-6',
    name: 'Red Hot Swimsuit',
    url: 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400',
    category: 'Swimwear',
    style: 'Party'
  },
  
  // --- DANCE & BALLET COLLECTION (Performance Wear) ---
  {
    id: 'dance-dynamic-1',
    name: 'Urban Dance Set',
    url: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400',
    category: 'Tops',
    style: 'Streetwear'
  },
  {
    id: 'dance-ballet-1',
    name: 'Classic White Tutu',
    url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400',
    category: 'Dresses',
    style: 'Formal'
  },
  {
    id: 'dance-dynamic-2',
    name: 'Contemporary Flow',
    url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400',
    category: 'Dresses',
    style: 'Sport'
  },
  {
    id: 'dance-ballet-2',
    name: 'Rehearsal Leotard',
    url: 'https://images.unsplash.com/photo-1544297787-8e6e580d8856?w=400',
    category: 'Dresses',
    style: 'Sport'
  },
  {
    id: 'dance-dynamic-3',
    name: 'Street Dance Hoodie',
    url: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400',
    category: 'Outerwear',
    style: 'Streetwear'
  },
  {
    id: 'dance-ballet-3',
    name: 'Stage Performance Dress',
    url: 'https://images.unsplash.com/photo-1516570695666-6b2170364802?w=400',
    category: 'Dresses',
    style: 'Formal'
  },
  {
    id: 'dance-dynamic-4',
    name: 'Modern Jazz Outfit',
    url: 'https://images.unsplash.com/photo-1551286948-262e3d30b927?w=400',
    category: 'Tops',
    style: 'Sport'
  },
  {
    id: 'dance-ballet-4',
    name: 'Black Swan Costume',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    category: 'Dresses',
    style: 'Formal'
  },
  {
    id: 'dance-dynamic-5',
    name: 'Freestyle Gear',
    url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400',
    category: 'Tops',
    style: 'Streetwear'
  },
  {
    id: 'dance-ballet-5',
    name: 'Pink Ballerina Dress',
    url: 'https://images.unsplash.com/photo-1572911634567-96538b4c0926?w=400',
    category: 'Dresses',
    style: 'Formal'
  },
  // Populating remaining items to reach 50 based on requested CSV volume
  // Using rotated valid images to ensure functionality
  {
    id: 'dance-mixed-11',
    name: 'Studio Dance Top',
    url: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400',
    category: 'Tops',
    style: 'Sport'
  },
  {
    id: 'dance-mixed-12',
    name: 'Ballet Warmup',
    url: 'https://images.unsplash.com/photo-1544297787-8e6e580d8856?w=400',
    category: 'Outerwear',
    style: 'Sport'
  },
  {
    id: 'dance-mixed-13',
    name: 'Hip Hop Pants',
    url: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400',
    category: 'Bottoms',
    style: 'Streetwear'
  },
  {
    id: 'dance-mixed-14',
    name: 'Lyrical Dress',
    url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400',
    category: 'Dresses',
    style: 'Formal'
  },
  {
    id: 'dance-mixed-15',
    name: 'Tap Dance Vest',
    url: 'https://images.unsplash.com/photo-1551286948-262e3d30b927?w=400',
    category: 'Tops',
    style: 'Formal'
  },
  {
    id: 'dance-mixed-16',
    name: 'Salsa Dress',
    url: 'https://images.unsplash.com/photo-1516570695666-6b2170364802?w=400',
    category: 'Dresses',
    style: 'Party'
  },
  {
    id: 'dance-mixed-17',
    name: 'Breakdance Tee',
    url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400',
    category: 'Tops',
    style: 'Streetwear'
  },
  {
    id: 'dance-mixed-18',
    name: 'Recital Costume',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    category: 'Dresses',
    style: 'Formal'
  },
  {
    id: 'dance-mixed-19',
    name: 'Practice Leggings',
    url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400',
    category: 'Bottoms',
    style: 'Sport'
  },
  {
    id: 'dance-mixed-20',
    name: 'Pointe Shoes & Tights',
    url: 'https://images.unsplash.com/photo-1572911634567-96538b4c0926?w=400',
    category: 'Bottoms',
    style: 'Formal'
  },
  { id: 'dance-21', name: 'Dynamic Move 21', url: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400', category: 'Tops', style: 'Sport' },
  { id: 'dance-22', name: 'Ballet Position 22', url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400', category: 'Dresses', style: 'Formal' },
  { id: 'dance-23', name: 'Dynamic Move 23', url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400', category: 'Tops', style: 'Sport' }
];
