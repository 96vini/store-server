import { Product } from '@/models/product';
import { ICreateProductRequest } from '@/interfaces/product';
import { IProduct } from '@/interfaces/product';
import { Location } from '@/types/types';
import { ObjectId } from 'mongoose';

export interface IProductRepository {
  findAll(): Promise<IProduct[]>;
  findOneById(id: ObjectId): Promise<IProduct | null>; // Corrigido o tipo de retorno para Promise<IProduct | null>
  findByUserId(user_id: ObjectId): Promise<IProduct[]>;
  findByLocation(location: Location): Promise<IProduct[]>;
  create(product: ICreateProductRequest): Promise<IProduct>; // Corrigido o tipo de entrada para ICreateProductRequest e tipo de retorno para Promise<IProduct>
  update(id: ObjectId, updatedProduct: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: ObjectId): Promise<void>;
}

class ProductRepository implements IProductRepository {
  async create(product: ICreateProductRequest): Promise<IProduct> {
    const newProduct = new Product(product);
    const savedProduct = await newProduct.save();
    return savedProduct;
  }

  async findAll(): Promise<IProduct[]> {
    const products = await Product.find().exec();
    return products;
  }

  async findOneById(id): Promise<IProduct | null> {
    try {
      const product = await Product.findById(id).exec();
      return product;
    } catch (error) {
      console.error('Error finding product by ID:', error);
      return null;
    }
  }

  async findByUserId(user_id: ObjectId): Promise<IProduct[]> {
    try {
      const products = await Product.find({ user: { id: user_id } }).sort({ created_at: -1 }).exec();
      return products;
    } catch (error) {
      console.error('Error finding products by user ID:', error);
      return [];
    }
  }

  async findByLocation(location: Location): Promise<IProduct[]> {
    try {
      const products = await Product.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: location.coordinates,
            },
            $maxDistance: location.radius,
          },
        },
      })
        .sort({ created_at: -1 })
        .exec();

      return products;
    } catch (error) {
      console.error('Error finding products by location:', error);
      return [];
    }
  }

  async update(id: ObjectId, updatedProduct: Partial<IProduct>): Promise<IProduct | null> {
    try {
      const existingProduct = await Product.findById(id).exec();

      if (!existingProduct) {
        console.log('Product not found');
        return null;
      }

      existingProduct.set(updatedProduct);
      const savedProduct = await existingProduct.save();

      return savedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  }

  async delete(id: ObjectId): Promise<void> {
    try {
      const existingProduct = await Product.findById(id).exec();
      console.log(existingProduct);
      if (!existingProduct) {
        console.log('Product not found');
        return;
      }

      await existingProduct.deleteOne({ _id: id }).exec();
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
}

export default new ProductRepository();
