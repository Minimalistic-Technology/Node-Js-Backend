import { Schema, model, Document } from 'mongoose';
import axios from 'axios';

interface ICategory extends Document {
    name: string;
    category: string;
    seoTitle: string;
    seoDescription: string;
}

interface ExternalCategory {
    _id: string;
    name: string;
}

// Fetch valid categories from external API
async function getValidCategories(): Promise<string[]> {
    try {
        const response = await axios.get('http://localhost:5000/api/bookstore/categories');
        const categories: ExternalCategory[] = response.data;
        return categories.map(category => category.name);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return ['school-books', 'college-books', 'professional-books', 'other']; // Fallback categories
    }
}

// Custom validator for category
const categoryValidator = async (value: string) => {
    const validCategories = await getValidCategories();
    return validCategories.includes(value);
};

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        validate: {
            validator: categoryValidator,
            message: (props: { value: string }) => `${props.value} is not a valid category`
        }
    },
    seoTitle: { type: String, required: true },
    seoDescription: { type: String, required: true }
});

export const Category = model<ICategory>('BookssCategory', categorySchema);