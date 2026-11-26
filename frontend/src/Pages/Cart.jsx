import { Link } from 'react-router'
import '../cartNotice.css'

export default function Cart({ cart, onQuantity, onRemove, notice }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return <main className="page-shell cart-page">
    <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> Cart</div>
    {notice && <p className="cart-notice" role="status">{notice}</p>}
    <div className="cart-table">
      <div className="cart-head"><span>Product</span><span>Price</span><span>Quantity</span><span>Subtotal</span></div>
      {cart.length === 0 ? <div className="empty-cart"><span>♧</span><h2>Your cart is empty</h2><p>Looks like you haven’t added anything yet.</p><Link className="primary-btn" to="/">Continue shopping</Link></div> :
        cart.map(item => <div className="cart-row" key={item.id}>
          <div className="cart-product"><button className="remove-item" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)}>×</button><img src={item.image} alt=""/><span>{item.name}</span></div>
          <span>${item.price.toFixed(2)}</span>
          <div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => onQuantity(item.id, item.quantity - 1)}>−</button><span>{item.quantity}</span><button aria-label="Increase quantity" onClick={() => onQuantity(item.id, item.quantity + 1)}>+</button></div>
          <b>${(item.price * item.quantity).toFixed(2)}</b>
        </div>)}
    </div>
    <div className="cart-actions"><Link className="outline-btn" to="/">Return To Shop</Link></div>
    {cart.length > 0 && <div className="cart-bottom"><div className="coupon"><input placeholder="Coupon Code"/><button className="primary-btn">Apply Coupon</button></div><section className="cart-total"><h2>Cart Total</h2><div><span>Subtotal:</span><b>${subtotal.toFixed(2)}</b></div><div><span>Shipping:</span><b>{subtotal > 140 ? 'Free' : '$10.00'}</b></div><div><span>Total:</span><b>${(subtotal + (subtotal > 140 ? 0 : 10)).toFixed(2)}</b></div><button className="primary-btn" onClick={() => alert('Checkout is ready to connect to your payment provider.')}>Proceed to checkout</button></section></div>}
  </main>
}
