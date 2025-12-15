Table User {
    id INT [pk, increment]
    name VARCHAR(100)
    email VARCHAR(100) [unique]
    password VARCHAR(100)
    created_at TIMESTAMP [default: `CURRENT_TIMESTAMP`]
    updated_at TIMESTAMP [default: `CURRENT_TIMESTAMP`]
}

Table Product {
    id INT [pk, increment]
    name VARCHAR(100)
    description TEXT
    price DECIMAL(10, 2)
    created_at TIMESTAMP [default: `CURRENT_TIMESTAMP`]
    updated_at TIMESTAMP [default: `CURRENT_TIMESTAMP`]
}

Table Order {
    id INT [pk, increment]
    user_id INT [ref: > User.id]
    total_amount DECIMAL(10, 2)
    status VARCHAR(50)
    created_at TIMESTAMP [default: `CURRENT_TIMESTAMP`]
    updated_at TIMESTAMP [default: `CURRENT_TIMESTAMP`]
}

Table OrderItem {
    id INT [pk, increment]
    order_id INT [ref: > Order.id]
    product_id INT [ref: > Product.id]
    quantity INT
    price DECIMAL(10, 2)
    created_at TIMESTAMP [default: `CURRENT_TIMESTAMP`]
    updated_at TIMESTAMP [default: `CURRENT_TIMESTAMP`]
}

Table Role {
    id INT [pk, increment]
    name VARCHAR(50) [unique]
    description TEXT
    created_at TIMESTAMP [default: `CURRENT_TIMESTAMP`]
    updated_at TIMESTAMP [default: `CURRENT_TIMESTAMP`]
}

Table Permissions {
    id INT [pk, increment]
    role_id INT [ref: > Role.id]
    name VARCHAR(100) [unique]
    description TEXT
    created_at TIMESTAMP [default: `CURRENT_TIMESTAMP`]
    updated_at TIMESTAMP [default: `CURRENT_TIMESTAMP`]
}

Ref: Order.user_id > User.id
Ref: OrderItem.order_id > Order.id
Ref: OrderItem.product_id > Product.id
Ref: Permissions.role_id > Role.id