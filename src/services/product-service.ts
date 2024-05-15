import { IProductRepository } from "@/repositories/product-repository";
import HttpResponse from '@/utils/HttpResponse';

class ProductService {
  readonly productRepository: IProductRepository;

  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async findAll() {
    const products = await this.productRepository.findAll();

    return HttpResponse.ok(products);
  }

  async findById(id) {
    const product = await this.productRepository.findOneById(id);

    return HttpResponse.ok(product);
  }

  async create(product) {
    const newProduct = await this.productRepository.create(product);

    return HttpResponse.created(newProduct);
  }

  async update(id, updatedProduct) {
    const editOrder = await this.productRepository.update(id, updatedProduct);
    return HttpResponse.ok(editOrder);
  }

  async delete(id) {
    const deleteOrder = await this.productRepository.delete(id);
    return HttpResponse.ok(deleteOrder);
  }

}

export default ProductService;