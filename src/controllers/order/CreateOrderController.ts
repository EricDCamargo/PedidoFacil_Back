import { Request, Response } from "express";
import { CreateOrderService } from "../../services/order/CreateOrderService";

class CreateOrderController {
  async handle(req: Request, res: Response) {
    const { table_id, name } = req.body;

    const createOrderService = new CreateOrderService();

    try {
      const order = await createOrderService.execute({ table_id, name });
      return res.json(order);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateOrderController };
