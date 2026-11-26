import { useEffect, useMemo, useState } from 'react'
import { products } from '../data/products'
import { getProducts } from '../services/productService'

const categories=['All','Fashion','Gaming','Accessories','Furniture']
function ProductCard({ product, onAdd }) { return <article className="product-card"><div className={`product-image ${product.color}`}><span className="discount">-{product.discount}%</span><div className="card-tools"><button aria-label="Add to wishlist">♡</button><button aria-label="Quick view">⌕</button></div><img src={product.image} alt={product.name}/><button className="add-btn" onClick={()=>onAdd(product)}>Add To Cart</button></div><div className="product-info"><h3>{product.name}</h3><p className="price">${product.price} <del>${product.oldPrice}</del></p><div className="rating"><span>★★★★★</span> <b>{product.rating}</b> <small>({product.reviews})</small></div></div></article> }

export default function Product({onAdd,notice}) {
 const [category,setCategory]=useState('All'); 
 const [query,setQuery]=useState(new URLSearchParams(location.search).get('q')||''); 
 const [sort,setSort]=useState('featured')
 const [catalog,setCatalog]=useState(products)
 useEffect(()=>{getProducts().then(({products:items})=>setCatalog(items.map((item,index)=>({...item,color:products[index%products.length].color})))).catch(()=>{})},[])
 const filtered=useMemo(()=>catalog.filter(p=>(category==='All'||p.category===category)&&p.name.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='price-low'?a.price-b.price:sort==='price-high'?b.price-a.price:0),[catalog,category,query,sort])
 return <main className="page-shell home-page"><div className="breadcrumb">Home <span>/</span> Store</div>
   <section className="hero-banner"><div className="hero-copy"><div className="hero-brand"><span className="apple-mark">●</span> iPhone 14 Series</div><h1>Up to 10%<br/>off Voucher</h1><a href="#products">Shop now <span>→</span></a></div><img src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=90" alt="New season smartphone"/><div className="hero-dots"><i/><i/><i/><i/><i/></div></section>
   <section className="section" id="products"><div className="section-kicker"><span/> Our products</div><div className="section-heading"><h2>Explore our products</h2><div className="product-controls"><div className="category-tabs">{categories.map(cat=><button key={cat} className={category===cat?'active':''} onClick={()=>setCategory(cat)}>{cat}</button>)}</div><select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div></div>
    {notice&&<p className="cart-notice" role="status">{notice}</p>}<div className="product-grid">{filtered.map(product=><ProductCard key={product.id} product={product} onAdd={onAdd}/>)}</div>{filtered.length===0&&<p className="empty-results">No products match your search. Try another term.</p>}<a className="primary-btn view-all" href="#products" onClick={()=>{setCategory('All');setQuery('')}}>View All Products</a></section>
   <section className="features"><div><span>🚚</span><h3>FREE AND FAST DELIVERY</h3><p>Free delivery for all orders over $140</p></div><div><span>◉</span><h3>24/7 CUSTOMER SERVICE</h3><p>Friendly 24/7 customer support</p></div><div><span>♧</span><h3>MONEY BACK GUARANTEE</h3><p>We return money within 30 days</p></div></section>
 </main>
}
