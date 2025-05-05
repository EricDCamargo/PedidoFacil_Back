enum OrderStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PAID = 'PAID',
  CLOSED = 'CLOSED'
}

enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED'
}

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export { OrderStatus, TableStatus, Role }
