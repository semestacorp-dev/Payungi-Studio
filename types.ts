/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type WardrobeCategory = 'Tops' | 'Bottoms' | 'Dresses' | 'Outerwear' | 'Accessories' | 'Traditional' | 'Swimwear' | 'Suits' | 'Custom';

export interface WardrobeItem {
  id: string;
  name: string;
  url: string;
  category: WardrobeCategory;
  style?: string;
  model3dUrl?: string; // Optional URL for the 3D model (.glb/.gltf)
}

export interface OutfitLayer {
  garment: WardrobeItem | null; // null represents the base model layer
  poseImages: Record<string, string>; // Maps pose instruction to image URL
}

export type PlaybackState = 'playing' | 'paused' | 'stopped' | 'loading' | 'umbrella' | 'tower';