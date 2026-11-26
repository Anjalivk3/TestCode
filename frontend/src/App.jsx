import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import Product from './Pages/Product'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Cart from './Pages/Cart'
import { getCart, addToCart as addCartItem, updateCartItem, removeFromCart as deleteCartItem } from './services/cartService'
import './App.css'

export function Header({ count }) {
  return <>
    <div className="announcement">Summer sale for all swim suits and free express delivery — OFF 50%! <a href="#products">Shop now</a><button aria-label="Dismiss announcement" onClick={(e) => e.currentTarget.parentElement.remove()}>×</button></div>
    <header className="site-header"><a className="wordmark" href="/">exclusive<span>.</span></a><nav><a href="/">Home</a><a href="/#products">Contact</a><a href="/#products">About</a><a href="/register">Sign up</a></nav><div className="header-actions"><label className="search-box"><input placeholder="What are you looking for?" onKeyDown={e=>{if(e.key==='Enter') window.location.href=`/?q=${encodeURIComponent(e.currentTarget.value)}#products`}}/><span>⌕</span></label><a className="icon-link" href="/#products" aria-label="Wishlist">♡</a><a className="icon-link cart-link" href="/cart" aria-label="Cart">♧{count>0&&<i>{count}</i>}</a></div></header>
  </>
}

export function Footer() { return <footer className="footer"><div><a className="wordmark light" href="/">exclusive<span>.</span></a><h3>Subscribe</h3><p>Get 10% off your first order</p><label className="subscribe"><input placeholder="Enter your email"/><button aria-label="Subscribe">➜</button></label></div><div><h3>Support</h3><p>111 Bijoy sarani, Dhaka,<br/>DH 1515, Bangladesh.</p><p>exclusive@gmail.com</p><p>+88015-88888-9999</p></div><div><h3>Account</h3><a href="/login">My account</a><a href="/register">Sign up</a><a href="/cart">Cart</a><a href="/#products">Shop</a></div><div><h3>Quick link</h3><a href="/#products">Privacy policy</a><a href="/#products">Terms of use</a><a href="/#products">FAQ</a><a href="/#products">Contact</a></div><div><h3>Download app</h3><p className="muted">Save $3 with App New User Only</p><div className="app-badges"><span>▦</span><span>Available on<br/><b>App Store</b></span></div></div><small>© Copyright Exclusive 2024. All rights reserved</small></footer> }

function App() {
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('exclusive-cart') || '[]') } catch { return [] } })
  useEffect(() => localStorage.setItem('exclusive-cart', JSON.stringify(cart)), [cart])
  const [cartNotice, setCartNotice] = useState('')
  const refreshCart = async () => {
    if (!localStorage.getItem('exclusive-token')) return
    try { const result = await getCart(); setCart(result.items) } catch (error) { setCartNotice(error.message) }
  }
  useEffect(() => { refreshCart() }, [])
  const addToCart = async (product, quantity=1) => {
    const token = localStorage.getItem('exclusive-token')
    if (!token) {
      setCart(current => { const found=current.find(item=>item.id===product.id); return found?current.map(item=>item.id===product.id?{...item,quantity:item.quantity+quantity}:item):[...current,{...product,quantity}] })
      setCartNotice('Added to your cart. Sign in or create an account to save it.')
      return
    }
    try { await addCartItem(product.id, quantity); await refreshCart(); setCartNotice('Added to your cart.') }
    catch (error) { setCartNotice(error.message) }
  }
  const updateQuantity = async (id, quantity) => {
    const next = Math.max(1,quantity)
    setCart(current=>current.map(item=>item.id===id?{...item,quantity:next}:item))
    if (localStorage.getItem('exclusive-token')) try { await updateCartItem(id, next) } catch (error) { setCartNotice(error.message) }
  }
  const removeFromCart = async id => {
    setCart(current=>current.filter(item=>item.id!==id))
    if (localStorage.getItem('exclusive-token')) try { await deleteCartItem(id) } catch (error) { setCartNotice(error.message) }
  }
  return <><Header count={cart.reduce((n,item)=>n+item.quantity,0)}/><Routes>
    <Route path="/" element={<Product onAdd={addToCart} notice={cartNotice}/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/cart" element={<Cart cart={cart} onQuantity={updateQuantity} onRemove={removeFromCart} notice={cartNotice}/>}/>
    <Route path="*" element={<Product onAdd={addToCart}/>}/>
  </Routes><Footer/></>
}

export default App
