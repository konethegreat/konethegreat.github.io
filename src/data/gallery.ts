export interface GalleryItem {
  /** Key into photos.generated.ts */
  photo: string
  alt: string
  caption: string
}

/** "Beyond the code". The two portraits are used in the hero and About sections. */
export const gallery: GalleryItem[] = [
  {
    photo: "cap",
    alt: "A smiling selfie of Kone in a black cap and dark zip-up top on a sunny rooftop, with trees and a quiet street behind him.",
    caption: "Sunny day, cap on.",
  },
  {
    photo: "graduation",
    alt: "Kone in a black graduation gown with a green and purple hood and aviator sunglasses, standing in a brick-paved courtyard.",
    caption: "Graduation day.",
  },
  {
    photo: "pups",
    alt: "Two Rottweiler puppies peering out of a cardboard box inside a plastic crate.",
    caption: "Puppy-break energy.",
  },
  {
    photo: "jersey",
    alt: "A close selfie of Kone squinting in the sun, wearing a sky-blue football shirt, with a brick wall and a tree behind him.",
    caption: "Match-day blue.",
  },
  {
    photo: "car",
    alt: "A pale-blue hatchback driving along a road beside a rock face, with a tunnel entrance ahead.",
    caption: "Open road.",
  },
]
