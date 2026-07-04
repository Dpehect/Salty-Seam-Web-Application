export type ProductId = 'aura-boucle' | 'travertine-console' | 'oasis-ottoman' | 'tide-vessel'

export interface MaterialSwatch {
  name: string
  hex: string
}

export interface Product {
  id: ProductId
  index: string
  name: string
  tagline: string
  description: string
  material: string
  materialNote: string
  origin: string
  year: string
  edition: string
  swatches: MaterialSwatch[]
  composition: 'left-dominant' | 'full-bleed' | 'split-vertical' | 'floating'
  gradientFrom: string
  gradientTo: string
  accentColor: string
}

export const products: Product[] = [
  {
    id: 'aura-boucle',
    index: '01',
    name: 'Aura Bouclé',
    tagline: 'Softness held in structure.',
    description:
      'Composed for rooms that breathe, Aura Bouclé carries the softness of salt ivory fiber against a sculptural, grounded silhouette. Each curve is shaped by hand, tightened where the frame meets fabric, and left intentionally loose where the material wants to move. A lounge piece that rewards stillness.',
    material: 'Bouclé, White Oak, Linen Lining',
    materialNote: 'Salt ivory bouclé over white oak armature with linen understructure.',
    origin: 'Alentejo, Portugal',
    year: '2024',
    edition: 'Limited — 40 pieces',
    swatches: [
      { name: 'Salt Ivory', hex: '#F0EBE1' },
      { name: 'Driftwood', hex: '#C4A882' },
      { name: 'Smoke Stone', hex: '#9B9189' },
      { name: 'Forest Depths', hex: '#2D4A35' },
    ],
    composition: 'left-dominant',
    gradientFrom: '#E8E0D4',
    gradientTo: '#D4C5A9',
    accentColor: '#B85C38',
  },
  {
    id: 'travertine-console',
    index: '02',
    name: 'Travertine Console',
    tagline: 'Architecture as furniture.',
    description:
      'The Travertine Console asks to be looked at from a distance first. Its mineral veining carries no two surfaces alike — a geological record pressed into a form that holds space without dominating it. Set against a wall or floated in a room, it holds the calm authority of stone.',
    material: 'Roman Travertine, Brushed Brass',
    materialNote: 'Honed travertine slab with filled finish, brushed brass hairpin base.',
    origin: 'Lazio, Italy',
    year: '2024',
    edition: 'Open Edition',
    swatches: [
      { name: 'Roman Sand', hex: '#C9B99A' },
      { name: 'Mineral Vein', hex: '#7A6E5E' },
      { name: 'Warm Brass', hex: '#B8975A' },
      { name: 'Deep Stone', hex: '#4A3F35' },
    ],
    composition: 'full-bleed',
    gradientFrom: '#D4C4AA',
    gradientTo: '#B8A88C',
    accentColor: '#1E3A2F',
  },
  {
    id: 'oasis-ottoman',
    index: '03',
    name: 'Oasis Ottoman',
    tagline: 'Low, wide, unhurried.',
    description:
      'Oasis Ottoman was designed from the ground up — literally. Beginning with the geometry of rest, it widens where the body meets it and rises only as far as it needs to. Upholstered in olive-toned textile with a natural foam core, it belongs in the corner of a room that understands patience.',
    material: 'Olive Textile, Natural Foam, Beech Base',
    materialNote: 'Hand-woven olive textile over a natural latex and foam core with turned beech legs.',
    origin: 'Alentejo, Portugal',
    year: '2024',
    edition: 'Limited — 60 pieces',
    swatches: [
      { name: 'Deep Olive', hex: '#5C6B45' },
      { name: 'Warm Sage', hex: '#8A9A6A' },
      { name: 'Earth Linen', hex: '#C4B090' },
      { name: 'Natural Wax', hex: '#D8C9A8' },
    ],
    composition: 'split-vertical',
    gradientFrom: '#8A9A6A',
    gradientTo: '#5C6B45',
    accentColor: '#B85C38',
  },
  {
    id: 'tide-vessel',
    index: '04',
    name: 'Tide Vessel',
    tagline: 'Clay shaped by salt memory.',
    description:
      'Thrown on a wheel, then interrupted. Tide Vessel is a sculptural ceramic object finished in a limestone slip that recalls the tidal line on coastal stone — the residue of water receding, leaving behind its mineral trace. Place it on stone, on wood, or alone. It does not need company.',
    material: 'Stoneware Clay, Limestone Slip',
    materialNote: 'Wheel-thrown stoneware fired at high temperature with hand-applied limestone slip glaze.',
    origin: 'Setúbal, Portugal',
    year: '2024',
    edition: 'Artist Edition — 20 pieces',
    swatches: [
      { name: 'Coastal Clay', hex: '#B5967A' },
      { name: 'Limestone', hex: '#D4CAB8' },
      { name: 'Charcoal Slip', hex: '#4A4440' },
      { name: 'Sea Mineral', hex: '#7A8C8A' },
    ],
    composition: 'floating',
    gradientFrom: '#C4A882',
    gradientTo: '#A08060',
    accentColor: '#1E3A2F',
  },
]
