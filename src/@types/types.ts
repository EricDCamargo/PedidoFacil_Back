enum OrderStatus {
  draft = 'draft',
  in_progress = 'in_progress',
  completed = 'completed',
  closed = 'closed'
}

enum TableStatus {
  available = 'available',
  occupied = 'occupied',
  reserved = 'reserved'
}
enum Role {
  admin = 'ADMIN',
  user = 'USER'
}

export { OrderStatus, TableStatus, Role }
