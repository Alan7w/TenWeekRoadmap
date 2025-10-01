export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium wireless headphones with active noise cancellation for immersive sound experience.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your health and fitness with this advanced smartwatch featuring heart rate monitoring.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Premium Coffee Maker',
    description: 'Automatic coffee maker with built-in grinder and multiple brewing options.',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    category: 'Home & Kitchen'
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable office chair with lumbar support and adjustable features.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b',
    category: 'Furniture'
  },
  {
    id: '5',
    name: 'Ultra HD Monitor',
    description: '32-inch 4K monitor perfect for work and entertainment.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc',
    category: 'Electronics'
  },
  {
    id: '6',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with customizable switches.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2',
    category: 'Electronics'
  },
  {
    id: '7',
    name: 'Wireless Gaming Mouse',
    description: 'High-precision wireless gaming mouse with customizable buttons.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    category: 'Electronics'
  },
  {
    id: '8',
    name: 'Smart Home Hub',
    description: 'Central control unit for your smart home devices.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827',
    category: 'Electronics'
  },
  {
    id: '9',
    name: 'Portable SSD 1TB',
    description: 'Fast and compact external SSD with USB-C connection.',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58',
    category: 'Electronics'
  },
  {
    id: '10',
    name: 'Premium Backpack',
    description: 'Water-resistant laptop backpack with multiple compartments.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    category: 'Accessories'
  },
  {
    id: '11',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07',
    category: 'Electronics'
  },
  {
    id: '12',
    name: 'Desk Lamp with USB Port',
    description: 'Modern LED desk lamp with built-in USB charging port.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
    category: 'Home & Office'
  },
  {
    id: '13',
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 20-hour battery life.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab',
    category: 'Electronics'
  },
  {
    id: '14',
    name: 'Standing Desk Converter',
    description: 'Adjustable standing desk converter for ergonomic work setup.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb',
    category: 'Furniture'
  },
  {
    id: '15',
    name: 'Webcam Pro',
    description: '1080p HD webcam with built-in microphone and auto-focus.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1629429408209-1f912961dbd8',
    category: 'Electronics'
  },
  {
    id: '16',
    name: 'Wireless Mouse Pad',
    description: 'Qi wireless charging mouse pad with RGB lighting.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    category: 'Electronics'
  },
  {
    id: '17',
    name: 'Cable Management Box',
    description: 'Clean up your workspace with this sleek cable management solution.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1611174743420-3d7df880ce32',
    category: 'Office'
  },
  {
    id: '18',
    name: 'Monitor Light Strip',
    description: 'USB-powered LED strip for monitor backlighting to reduce eye strain.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1590324579681-f68ae9c61e2c',
    category: 'Electronics'
  },
  {
    id: '19',
    name: 'Under-Desk Footrest',
    description: 'Ergonomic footrest with adjustable height and massage surface.',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    category: 'Office'
  },
  {
    id: '20',
    name: 'Air Purifier',
    description: 'Desktop air purifier with HEPA filter and air quality indicator.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1573336463768-dd8b107989fb',
    category: 'Home & Office'
  }
];