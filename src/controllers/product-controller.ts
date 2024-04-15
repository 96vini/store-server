import { FastifyRequest, FastifyReply } from 'fastify';

import ProductService from '@/services/product-service';

import {
  IProduct,
  ICreateProductRequest,
  IUpdateProductRequest,
  IFindProductByIdRequest,
  IDeleteProductRequest
} from '@/models/product';

export default class ProductController {
  readonly productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async findAll(req: FastifyRequest, reply: FastifyReply) {
    const products = await this.productService.findAll();

    if (!products) {
      return reply.status(404).send("Nenhum registro de pedido foi encontrado!");
    }

    return reply.status(200).send(products);
  }

  async findById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as IFindProductByIdRequest;
    const product = await this.productService.findById(id);

    if (!product) {
      return reply.status(404).send(`Nenhum pedido foi encontrado com o ID ${id}`);
    }

    return reply.status(200).send(product);
  }

  async create(req: FastifyRequest, reply: FastifyReply) {

    const productData = req.body as ICreateProductRequest;
  
    const { name, category, price, color, size, dimensions } = productData;

    if (!name || !category || !price || !color || !size || !dimensions) {
      return reply.status(400).send("Erro ao criar produto, verifique os campos.");
    }

    const newProduct = await this.productService.create(productData);

    return reply.status(201).send(newProduct);
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as IUpdateProductRequest;
    const productData = req.body as IProduct;

    const updatedProduct = await this.productService.update(id, productData);

    if (!updatedProduct) {
      return reply.status(404).send("Produto não encontrado");
    }

    return reply.status(200).send(updatedProduct);
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as IDeleteProductRequest;

    const deletedproduct = await this.productService.delete(id);

    if (!deletedproduct) {
      return reply.status(404).send("Pedido não encontrado");
    }

    return reply.status(200).send(deletedproduct);
  }
}
