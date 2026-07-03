import { create } from 'zustand';
import { type Product } from '@/lib/schemas/product';

export interface CartItem {
	product: Product;
	quantity: number;
}

interface CartState {
	items: CartItem[];
	addItem: (product: Product, quantity?: number) => void;
	removeItem: (productName: string) => void;
	updateQuantity: (productName: string, quantity: number) => void;
	clearCart: () => void;
	totalItems: () => number;
	totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	
	addItem: (product, quantity = 1) => {
		const items = get().items;
		const existingIndex = items.findIndex((item) => item.product.name === product.name);

		if (existingIndex > -1) {
			const updatedItems = [...items];
			updatedItems[existingIndex].quantity += quantity;
			set({ items: updatedItems });
		} else {
			set({ items: [...items, { product, quantity }] });
		}
	},

	removeItem: (productName) => {
		set({
			items: get().items.filter((item) => item.product.name !== productName)
		});
	},

	updateQuantity: (productName, quantity) => {
		if (quantity <= 0) {
			get().removeItem(productName);
			return;
		}
		const updatedItems = get().items.map((item) =>
			item.product.name === productName ? { ...item, quantity } : item
		);
		set({ items: updatedItems });
	},

	clearCart: () => set({ items: [] }),

	totalItems: () => {
		return get().items.reduce((acc, item) => acc + item.quantity, 0);
	},

	totalPrice: () => {
		return get().items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
	}
}));
