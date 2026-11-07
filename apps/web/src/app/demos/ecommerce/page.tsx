'use client';

import React, { useState } from 'react';
import {
  Search, Star, ShoppingCart, ShieldCheck, CheckCircle2, SlidersHorizontal,
  Laptop, Check, Heart, BarChart2, Tag, Truck, RotateCcw, MessageSquare,
  ChevronDown, ChevronUp, X, Package, Zap, Award, Clock, Plus, Minus,
} from 'lucide-react';

const CATEGORIES = ['All', 'Gaming Laptops', 'Business Laptops', 'Ultrabooks', 'Workstations'];

const BRANDS = ['All', 'HP', 'Dell', 'ASUS', 'Lenovo', 'Acer', 'Apple'];

const LAPTOPS = [
  {
    id: 'lap_hp_victus_16gb', name: 'HP Victus Gaming 15 (2024)', brand: 'HP', category: 'Gaming Laptops',
    ram: '16GB', storage: '512GB SSD', gpu: 'RTX 3050 6GB', display: '144Hz FHD IPS', battery: '70Wh',
    price: 74990, mrp: 89999, rating: 4.8, reviewCount: 1420, badge: 'Best Seller',
    inStock: true, color: 'from-blue-600 to-slate-900',
    specs: ['AMD Ryzen 7 7735HS', '16GB DDR5 RAM', '144Hz FHD Display', 'RTX 3050 6GB', 'Wi-Fi 6E'],
    reviews: [
      { user: 'Rahul M.', rating: 5, comment: 'Excellent gaming performance under ₹80k. Thermals are great.' },
      { user: 'Sneha K.', rating: 5, comment: 'Best laptop in this price range. 144Hz makes a huge difference.' },
      { user: 'Arjun P.', rating: 4, comment: 'Great value. Battery could be better but performance is top-notch.' },
    ],
  },
  {
    id: 'lap_lenovo_loq', name: 'Lenovo LOQ 15.6" (Gen 9)', brand: 'Lenovo', category: 'Gaming Laptops',
    ram: '16GB', storage: '512GB SSD', gpu: 'RTX 3050', display: '144Hz IPS', battery: '60Wh',
    price: 78990, mrp: 94999, rating: 4.6, reviewCount: 980, badge: 'Trending',
    inStock: true, color: 'from-slate-700 to-indigo-950',
    specs: ['Intel Core i5-13420H', '16GB DDR5 RAM', '144Hz IPS Panel', 'RTX 3050', 'RGB Backlit'],
    reviews: [
      { user: 'Vikram S.', rating: 5, comment: 'Solid build quality. Great for both work and gaming.' },
      { user: 'Priya R.', rating: 4, comment: 'Good display, fast processor. Slightly heavy.' },
    ],
  },
  {
    id: 'lap_asus_tuf', name: 'ASUS TUF Gaming A15 (2024)', brand: 'ASUS', category: 'Gaming Laptops',
    ram: '16GB', storage: '1TB SSD', gpu: 'RTX 4050', display: '144Hz FHD', battery: '90Wh',
    price: 89990, mrp: 109999, rating: 4.7, reviewCount: 2150, badge: 'Editor\'s Choice',
    inStock: true, color: 'from-amber-600 to-slate-950',
    specs: ['AMD Ryzen 7 7745HX', '16GB DDR5 RAM', '1TB PCIe Gen4 SSD', 'RTX 4050', 'MIL-STD-810H'],
    reviews: [
      { user: 'Amit D.', rating: 5, comment: 'Military grade build. RTX 4050 handles everything I throw at it.' },
    ],
  },
  {
    id: 'lap_dell_xps', name: 'Dell XPS 15 (OLED, Core i7)', brand: 'Dell', category: 'Ultrabooks',
    ram: '32GB', storage: '1TB SSD', gpu: 'RTX 4060', display: '3.5K OLED 60Hz', battery: '86Wh',
    price: 184990, mrp: 209999, rating: 4.9, reviewCount: 755, badge: 'Premium',
    inStock: true, color: 'from-cyan-800 to-slate-950',
    specs: ['Intel Core i7-13700H', '32GB DDR5 RAM', '3.5K OLED Touch', 'RTX 4060', 'Thunderbolt 4'],
    reviews: [
      { user: 'Nisha T.', rating: 5, comment: 'The OLED display is absolutely stunning. Worth every rupee.' },
    ],
  },
  {
    id: 'lap_macbook_pro', name: 'Apple MacBook Pro 14" (M3 Pro)', brand: 'Apple', category: 'Workstations',
    ram: '18GB', storage: '512GB SSD', gpu: 'M3 Pro GPU 18-core', display: 'Liquid Retina XDR', battery: '70Wh',
    price: 199990, mrp: 219000, rating: 4.9, reviewCount: 3210, badge: '🍎 Apple',
    inStock: true, color: 'from-slate-400 to-slate-900',
    specs: ['Apple M3 Pro 11-core CPU', '18GB Unified Memory', 'Liquid Retina XDR 120Hz', '22hr Battery'],
    reviews: [
      { user: 'Kavya M.', rating: 5, comment: 'Incredible performance for video editing. Runs completely silent.' },
    ],
  },
  {
    id: 'lap_acer_nitro', name: 'Acer Nitro V 15 (Ryzen 7)', brand: 'Acer', category: 'Gaming Laptops',
    ram: '16GB', storage: '512GB SSD', gpu: 'RTX 4050 6GB', display: '144Hz IPS', battery: '57Wh',
    price: 76990, mrp: 94999, rating: 4.5, reviewCount: 840, badge: 'Value Pick',
    inStock: true, color: 'from-red-700 to-slate-950',
    specs: ['AMD Ryzen 7 7735HS', '16GB DDR5 RAM', '144Hz IPS', 'RTX 4050 6GB', 'NitroSense Cooling'],
    reviews: [
      { user: 'Dev A.', rating: 5, comment: 'Best budget gaming laptop. Stays cool under load.' },
    ],
  },
];

type CheckoutStep = 'cart' | 'address' | 'payment' | 'review' | 'success';

export default function EcommerceDemoPage() {
  const [search, setSearch] = useState('HP Victus');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedRam, setSelectedRam] = useState<'All'|'8GB'|'16GB'|'32GB'>('16GB');
  const [maxPrice, setMaxPrice] = useState(80000);
  const [cart, setCart] = useState<typeof LAPTOPS>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string|null>(null);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep|null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [address, setAddress] = useState({ fullName:'', email:'', phone:'', address:'', city:'', pincode:'', state:'' });
  const [payment, setPayment] = useState({ cardNumber:'', cardName:'', expiry:'', cvv:'', upiId:'' });
  const [paymentMethod, setPaymentMethod] = useState<'card'|'upi'|'emi'|'cod'>('card');

  const filtered = LAPTOPS.filter(l => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || l.category === selectedCategory;
    const matchBrand = selectedBrand === 'All' || l.brand === selectedBrand;
    const matchRam = selectedRam === 'All' || l.ram === selectedRam;
    const matchPrice = l.price <= maxPrice;
    return matchSearch && matchCat && matchBrand && matchRam && matchPrice;
  }).sort((a, b) => b.rating - a.rating);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * (quantities[item.id] || 1), 0);
  const discount = couponApplied ? Math.round(cartTotal * 0.10) : 0;

  const addToCart = (p: typeof LAPTOPS[0]) => {
    if (!cart.find(c => c.id === p.id)) {
      setCart(prev => [...prev, p]);
      setQuantities(prev => ({ ...prev, [p.id]: 1 }));
    }
  };

  const toggleWishlist = (id: string) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'isro2025' || couponCode.toLowerCase() === 'save10') setCouponApplied(true);
  };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="p-5 rounded-3xl glass-card border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full badge-glow-sky text-xs font-mono font-bold">DEMO 1 / 5 · E-COMMERCE</span>
            <h1 className="text-2xl font-extrabold text-white">ApexTech Electronics Store</h1>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Agent Goal: <span className="text-sky-400">"Find HP Victus 16GB under ₹80k, add to cart, apply coupon ISRO2025, fill address, and complete checkout."</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCheckoutStep('cart')} className="relative flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-bold shadow-lg transition-all hover:scale-105">
            <ShoppingCart className="w-4 h-4" /> Cart ({cart.length})
            {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full text-[10px] font-black flex items-center justify-center">{cart.length}</span>}
          </button>
        </div>
      </div>

      {!checkoutStep ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Sidebar Filters */}
          <div className="space-y-4">
            {/* Category */}
            <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-sky-400" /> Filters</h3>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1.5">Category</p>
                <div className="space-y-1.5">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setSelectedCategory(c)}
                      className={`w-full text-left text-xs px-3 py-1.5 rounded-xl transition-all font-medium ${selectedCategory === c ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-white'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1.5">Brand</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {BRANDS.map(b => (
                    <button key={b} onClick={() => setSelectedBrand(b)}
                      className={`text-xs px-2 py-1.5 rounded-xl border transition-all font-bold ${selectedBrand === b ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' : 'border-white/5 text-slate-400 hover:border-white/20'}`}>{b}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1.5">RAM</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['All','8GB','16GB','32GB'] as const).map(r => (
                    <button key={r} onClick={() => setSelectedRam(r)}
                      className={`text-xs px-2 py-1.5 rounded-xl border transition-all font-bold ${selectedRam === r ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' : 'border-white/5 text-slate-400 hover:border-white/20'}`}>{r}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400 font-bold uppercase">Max Price</span>
                  <span className="text-emerald-400 font-mono font-bold">₹{maxPrice.toLocaleString()}</span>
                </div>
                <input type="range" min="50000" max="210000" step="5000" value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-full accent-sky-500" />
              </div>
            </div>

            {/* Coupon */}
            <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2"><Tag className="w-4 h-4 text-amber-400" /> Coupon Code</h3>
              <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Try: ISRO2025 or SAVE10"
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono" />
              <button onClick={applyCoupon} className="w-full py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/30 transition-all">
                {couponApplied ? '✓ 10% Discount Applied!' : 'Apply Coupon'}
              </button>
            </div>

            {/* Delivery info */}
            <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold"><Truck className="w-4 h-4" /> Free Delivery on orders over ₹50,000</div>
              <div className="flex items-center gap-2 text-sky-400 font-semibold"><RotateCcw className="w-4 h-4" /> 30-Day Easy Returns</div>
              <div className="flex items-center gap-2 text-amber-400 font-semibold"><Award className="w-4 h-4" /> 2-Year Warranty Included</div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search laptops, brands..."
                  className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500" />
              </div>
              <span className="text-xs text-slate-400 font-mono">{filtered.length} results · Sorted by Rating</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map(product => {
                const inCart = cart.some(c => c.id === product.id);
                const inWish = wishlist.includes(product.id);
                const qty = quantities[product.id] || 1;
                const isExpanded = expandedProduct === product.id;
                return (
                  <div key={product.id} className="p-5 rounded-3xl glass-card border border-white/10 glass-card-hover flex flex-col group">
                    <div>
                      {/* Product Image */}
                      <div className={`h-36 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center relative mb-4 shadow-inner`}>
                        <Laptop className="w-16 h-16 text-white/90 group-hover:scale-105 transition-transform" />
                        {product.badge && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 text-[10px] font-bold text-amber-400 border border-amber-500/30">{product.badge}</span>
                        )}
                        <button onClick={() => toggleWishlist(product.id)} className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/50 hover:bg-black/80 transition-all">
                          <Heart className={`w-4 h-4 ${inWish ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                        </button>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {product.rating} <span className="text-slate-500 font-normal">({product.reviewCount.toLocaleString()} reviews)</span>
                        <span className="ml-auto text-[10px] text-slate-400 font-mono">{product.ram} · {product.storage}</span>
                      </div>

                      <h3 className="text-xs font-extrabold text-white leading-snug mb-2 group-hover:text-sky-300 transition-colors">{product.name}</h3>

                      {/* Specs */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.specs.slice(0, 3).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-white/5 text-[9px] text-slate-300 font-mono">{s}</span>
                        ))}
                      </div>

                      {/* Expandable Details */}
                      <button onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                        className="w-full text-left text-[11px] text-sky-400 font-bold flex items-center gap-1 mb-2 hover:text-sky-300">
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {isExpanded ? 'Hide Details' : 'Full Specs & Reviews'}
                      </button>

                      {isExpanded && (
                        <div className="space-y-3 mb-3 p-3 rounded-xl bg-slate-950/80 border border-white/10">
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                            {[['GPU', product.gpu], ['Display', product.display], ['Battery', product.battery]].map(([k, v]) => (
                              <div key={k}><span className="text-slate-500">{k}: </span><span className="text-white">{v}</span></div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Customer Reviews</p>
                            {product.reviews.map((r, i) => (
                              <div key={i} className="p-2 rounded-lg bg-slate-900/80 border border-white/5">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span className="text-[10px] font-bold text-white">{r.user}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-snug">{r.comment}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-2 mt-auto">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">MRP: <span className="line-through">₹{product.mrp.toLocaleString()}</span></span>
                          <span className="text-lg font-black text-white font-mono">₹{product.price.toLocaleString()}</span>
                          <span className="ml-2 text-[10px] text-emerald-400 font-bold">{Math.round((1-product.price/product.mrp)*100)}% off</span>
                        </div>
                        {inCart && (
                          <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-xl px-2 py-1">
                            <button onClick={() => setQuantities(prev => ({...prev,[product.id]:Math.max(1,qty-1)}))}><Minus className="w-3.5 h-3.5 text-slate-400" /></button>
                            <span className="text-xs font-bold text-white w-5 text-center">{qty}</span>
                            <button onClick={() => setQuantities(prev => ({...prev,[product.id]:qty+1}))}><Plus className="w-3.5 h-3.5 text-slate-400" /></button>
                          </div>
                        )}
                      </div>
                      <button onClick={() => addToCart(product)} data-testid={`add-to-cart-${product.id}`}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${inCart ? 'bg-emerald-600 text-white' : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg hover:scale-[1.02]'}`}>
                        {inCart ? <><Check className="w-4 h-4" /> Added to Cart</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
                      </button>
                      {!inCart && (
                        <button onClick={() => { addToCart(product); setCheckoutStep('address'); }}
                          className="w-full py-2 rounded-xl text-xs font-bold border border-white/10 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-amber-400" /> Buy Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : checkoutStep === 'cart' ? (
        /* ── CART VIEW ── */
        <div className="max-w-3xl mx-auto p-6 rounded-3xl glass-card border border-white/10 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-lg font-extrabold text-white">Shopping Cart ({cart.length} items)</h2>
            <button onClick={() => setCheckoutStep(null)} className="text-xs text-sky-400 hover:underline">← Continue Shopping</button>
          </div>
          {cart.length === 0 ? <p className="text-center text-slate-400 py-8 text-xs">Your cart is empty.</p> : (
            <>
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/80 border border-white/10">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                    <Laptop className="w-8 h-8 text-white/80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.ram} · {item.storage}</p>
                    <p className="text-sm font-black text-white font-mono mt-0.5">₹{(item.price * (quantities[item.id]||1)).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-xl px-2 py-1">
                    <button onClick={() => setQuantities(p => ({...p,[item.id]:Math.max(1,(quantities[item.id]||1)-1)}))}>
                      <Minus className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <span className="text-xs font-bold text-white w-5 text-center">{quantities[item.id]||1}</span>
                    <button onClick={() => setQuantities(p => ({...p,[item.id]:(quantities[item.id]||1)+1}))}>
                      <Plus className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                  <button onClick={() => setCart(c => c.filter(x => x.id !== item.id))}><X className="w-4 h-4 text-slate-500 hover:text-rose-400 transition-colors" /></button>
                </div>
              ))}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300"><span>Subtotal</span><span className="font-mono">₹{cartTotal.toLocaleString()}</span></div>
                {couponApplied && <div className="flex justify-between text-emerald-400"><span>Coupon (ISRO2025)</span><span className="font-mono">-₹{discount.toLocaleString()}</span></div>}
                <div className="flex justify-between text-slate-300"><span>Delivery</span><span className="text-emerald-400 font-bold">FREE</span></div>
                <div className="flex justify-between text-white font-bold text-sm border-t border-white/10 pt-2"><span>Total</span><span className="font-mono">₹{(cartTotal-discount).toLocaleString()}</span></div>
              </div>
              <button onClick={() => setCheckoutStep('address')} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-bold shadow-lg transition-all hover:scale-[1.01] flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Proceed to Checkout
              </button>
            </>
          )}
        </div>
      ) : checkoutStep === 'address' ? (
        /* ── ADDRESS FORM ── */
        <div className="max-w-2xl mx-auto p-6 rounded-3xl glass-card border border-white/10 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-lg font-extrabold text-white">Delivery Address</h2>
            <div className="flex gap-2 text-[10px] font-mono">
              {(['cart','address','payment','review'] as const).map((s, i) => (
                <span key={s} className={`px-2 py-0.5 rounded ${checkoutStep === s ? 'bg-sky-500 text-white' : i < ['cart','address','payment','review'].indexOf(checkoutStep) ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {i+1}. {s.charAt(0).toUpperCase()+s.slice(1)}
                </span>
              ))}
            </div>
          </div>
          <form onSubmit={e => { e.preventDefault(); setCheckoutStep('payment'); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'fullName', type: 'text', auto: 'name', ph: 'Harish Kumar' },
                { label: 'Email Address', key: 'email', type: 'email', auto: 'email', ph: 'harish.kumar@example.com' },
                { label: 'Phone Number', key: 'phone', type: 'tel', auto: 'tel', ph: '+91 9876543210' },
                { label: 'Flat/House No. & Street', key: 'address', type: 'text', auto: 'street-address', ph: '42, Silicon Residency, Koramangala' },
                { label: 'City', key: 'city', type: 'text', auto: 'address-level2', ph: 'Bengaluru' },
                { label: 'PIN Code', key: 'pincode', type: 'text', auto: 'postal-code', ph: '560034' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">{f.label} <span className="text-rose-400">*</span></label>
                  <input type={f.type} autoComplete={f.auto} placeholder={f.ph} required
                    value={(address as any)[f.key]} onChange={e => setAddress(p => ({...p,[f.key]:e.target.value}))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500" />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">State</label>
                <select value={address.state} onChange={e => setAddress(p => ({...p, state: e.target.value}))}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white bg-slate-950">
                  <option value="">Select State</option>
                  {['Karnataka','Maharashtra','Tamil Nadu','Delhi','Telangana','Uttar Pradesh','Gujarat','Rajasthan'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2">
              Continue to Payment →
            </button>
          </form>
        </div>
      ) : checkoutStep === 'payment' ? (
        /* ── PAYMENT FORM ── */
        <div className="max-w-2xl mx-auto p-6 rounded-3xl glass-card border border-white/10 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-lg font-extrabold text-white">Payment Method</h2>
            <button onClick={() => setCheckoutStep('address')} className="text-xs text-sky-400 hover:underline">← Back</button>
          </div>
          {/* Payment Method Selector */}
          <div className="grid grid-cols-4 gap-2">
            {(['card','upi','emi','cod'] as const).map(m => (
              <button key={m} onClick={() => setPaymentMethod(m)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${paymentMethod === m ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
                {m === 'card' ? '💳 Card' : m === 'upi' ? '📲 UPI' : m === 'emi' ? '📅 EMI' : '🏠 COD'}
              </button>
            ))}
          </div>
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              {[
                { label:'Card Number', key:'cardNumber', ph:'4111 •••• •••• 1111', type:'text' },
                { label:'Name on Card', key:'cardName', ph:'HARISH KUMAR', type:'text' },
                { label:'Expiry (MM/YY)', key:'expiry', ph:'12/27', type:'text' },
                { label:'CVV', key:'cvv', ph:'•••', type:'password' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={(payment as any)[f.key]}
                    onChange={e => setPayment(p => ({...p,[f.key]:e.target.value}))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono" />
                </div>
              ))}
            </div>
          )}
          {paymentMethod === 'upi' && (
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1.5">UPI ID</label>
              <input type="text" placeholder="harish.kumar@okaxis" value={payment.upiId}
                onChange={e => setPayment(p => ({...p, upiId: e.target.value}))}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono" />
            </div>
          )}
          {paymentMethod === 'emi' && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-white">Select EMI Plan</p>
              {[{m:3,i:'0%'},{m:6,i:'1.5%'},{m:12,i:'2%'}].map(plan => (
                <label key={plan.m} className="flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-sky-500/30 cursor-pointer">
                  <input type="radio" name="emi" className="accent-sky-500" />
                  <span className="text-xs text-slate-200">{plan.m} months — ₹{Math.round((cartTotal-discount)/plan.m).toLocaleString()}/mo <span className="text-slate-400">({plan.i} interest)</span></span>
                </label>
              ))}
            </div>
          )}
          {paymentMethod === 'cod' && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
              Cash on Delivery available. ₹50 COD fee applicable. Pay at doorstep on delivery.
            </div>
          )}
          <button onClick={() => setCheckoutStep('review')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Review Order →
          </button>
        </div>
      ) : checkoutStep === 'review' ? (
        /* ── ORDER REVIEW ── */
        <div className="max-w-2xl mx-auto p-6 rounded-3xl glass-card border border-white/10 space-y-5">
          <h2 className="text-lg font-extrabold text-white pb-3 border-b border-white/10">Review & Confirm Order</h2>
          <div className="space-y-3 text-xs">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/80 border border-white/10">
                <Laptop className="w-8 h-8 text-sky-400" />
                <div className="flex-1"><p className="font-bold text-white">{item.name}</p><p className="text-slate-400">Qty: {quantities[item.id]||1}</p></div>
                <span className="font-mono font-black text-white">₹{(item.price*(quantities[item.id]||1)).toLocaleString()}</span>
              </div>
            ))}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-slate-300 space-y-1">
              <p className="font-bold text-white">Delivery Address:</p>
              <p>{address.fullName} · {address.phone}</p>
              <p>{address.address}, {address.city}, {address.state} - {address.pincode}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-1">
              <div className="flex justify-between text-slate-300"><span>Subtotal</span><span className="font-mono">₹{cartTotal.toLocaleString()}</span></div>
              {couponApplied && <div className="flex justify-between text-emerald-400"><span>Coupon Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
              <div className="flex justify-between text-white font-bold border-t border-white/10 pt-1"><span>Grand Total</span><span className="font-mono text-sm">₹{(cartTotal-discount).toLocaleString()}</span></div>
            </div>
          </div>
          <button onClick={() => setCheckoutStep('success')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2">
            <Package className="w-4 h-4" /> Place Order ₹{(cartTotal-discount).toLocaleString()}
          </button>
        </div>
      ) : (
        /* ── SUCCESS ── */
        <div className="max-w-xl mx-auto p-10 rounded-3xl glass-card border border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl badge-glow-emerald flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">Order Placed!</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
            Order <span className="font-mono text-sky-400 font-bold">#APX-{Math.floor(Math.random()*90000+10000)}-VICTUS</span> confirmed.
            Estimated delivery: <span className="text-emerald-400 font-bold">2-4 Business Days</span>.
            All PII was resolved locally — 0 raw data transmitted to cloud.
          </p>
          <button onClick={() => { setCheckoutStep(null); setCart([]); setCouponApplied(false); }}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white text-xs font-bold">
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
}
