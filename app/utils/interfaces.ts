export interface JwtPayload {
    username: string,
    uid: string
}

export enum AmountType {
    GRAM = 'g',
    KILOGRAM = 'kg',
    MILLILITER = 'ml',
    LITER = 'litre',
    COUNT = 'count',

    POUND = 'lb',
    OUNCE = 'oz',
    GALLON = 'gal',
    QUART = 'qt',
    PINT = 'pt',
    CUP = 'cup',
    TABLESPOON = 'tbsp',
    TEASPOON = 'tsp',
    FLUID_OUNCE = 'fl oz',

    PINCH = 'pinch',
    SERVING = 'serving'
};

export interface Category {
    cid: number;
    category_name: string;
    uid: string;
}

export interface Ingredient {
    iid: number;
    ingredient_name: string;
    expiration: Date;
    amount: number;
    amount_type: AmountType;
    cid: number;
}

export interface RecipeIngredient {
    rid?: number;
    ingredient_name: string;
    amount: string;
    amount_type: string;
}