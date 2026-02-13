import { Cart } from "./entities/cart.entity";

export const CART_REPOSITORY = 'CART_REPOSITORY';

export interface ICartRepository {
    findActiveCartByUser(userId: string): Promise<any | null>;
    findProductById(productId: string): Promise<any | null>;

    createCart(userId: string): Promise<any>;

    addCartItem(data: {
        cartId: string;
        productId: string;
        quantity: number;
        price: number;
    }): Promise<any>;

    updateItemQuantity(
        productId: string,
        userId: string,
        quantity: number,
    ): Promise<boolean>;

    findCartItems(userId: string): Promise<any[]>;

    findCartItem(
        productId: string,
        userId: string,
    ): Promise<any | null>;

    removeItemsByIds(
        ids: string[],
        userId: string,
    ): Promise<boolean>;

    removeByProductId(
        productId: string,
        userId: string,
    ): Promise<boolean>;
}
