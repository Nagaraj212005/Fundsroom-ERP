import { useEffect, useState } from 'react'
import './App.css'
import OrdersPanel from './OrdersPanel.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`, ...options.headers } })
  const body = await response.json()
  if (!response.ok) throw new Error(body.message || 'Request failed')
  return body.data
}

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@fundsroom.com', password: 'Admin@123' })
  const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    try {
      const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(form) })
      localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); onLogin(data.user)
    } catch (err) { setError(err.message) }
  }
  return <main className="login-shell"><div className="login-panel"><span className="kicker">FUNDSROOM / ERP</span><h1>Manage your<br />workflow.</h1><p>Move every customer request from enquiry to dispatch in one clear workspace.</p><form onSubmit={submit}><label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>{error && <div className="error">{error}</div>}<button className="primary" type="submit">Sign in <span>-&gt;</span></button></form></div><div className="login-art"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="art-copy"><strong>16</strong><span>units ready to move</span></div></div></main>
}

const emptyEnquiry = { enquiryNumber: '', customerId: '', employeeId: '', status: 'NEW' }

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [view, setView] = useState('overview')
  const [data, setData] = useState({ enquiries: [], quotations: [], orders: [], inventory: [], customers: [], products: [] })
  const [notice, setNotice] = useState('')
  const [enquiry, setEnquiry] = useState(emptyEnquiry)
  const [quotation, setQuotation] = useState({ quotationNumber: '', enquiryId: '', customerId: '', employeeId: '', discount: 0, gst: 18, productId: '', quantity: 1, unitPrice: 0 })
  const [order, setOrder] = useState({ orderNumber: '', quotationId: '' })

  const load = async () => {
    try { const [enquiries, quotations, orders, inventory, customers, products] = await Promise.all(['/enquiries', '/quotations', '/sales-orders', '/inventory', '/customers', '/products'].map(request)); setData({ enquiries, quotations, orders, inventory, customers, products }) } catch (err) { setNotice(err.message) }
  }
  useEffect(() => { if (user) load() }, [user])
  if (!user) return <Login onLogin={setUser} />

  const signOut = () => { localStorage.clear(); setUser(null) }
  const submitEnquiry = async (event) => { event.preventDefault(); try { await request('/enquiries', { method: 'POST', body: JSON.stringify(enquiry) }); setEnquiry(emptyEnquiry); setNotice('Enquiry created.'); load() } catch (err) { setNotice(err.message) } }
  const submitQuotation = async (event) => { event.preventDefault(); try {
    const { productId, quantity, unitPrice, ...quotationPayload } = quotation
    await request('/quotations', {
      method: 'POST',
      body: JSON.stringify({
        ...quotationPayload,
        discount: Number(quotation.discount),
        gst: Number(quotation.gst),
        items: [{ productId, quantity: Number(quantity), unitPrice: Number(unitPrice) }]
      })
    })
    setNotice('Quotation created.')
    load()
  } catch (err) { setNotice(err.message) } }
  const submitOrder = async (event) => { event.preventDefault(); try { await request('/sales-orders', { method: 'POST', body: JSON.stringify(order) }); setNotice('Sales order created.'); load() } catch (err) { setNotice(err.message) } }
  const reserveOrder = async (salesOrderId, inventoryId, quantity) => { try { await request('/inventory-reservations', { method: 'POST', body: JSON.stringify({ salesOrderId, inventoryId, quantity: Number(quantity) }) }); setNotice('Inventory reserved.'); load() } catch (err) { setNotice(err.message) } }
  const dispatchOrder = async (salesOrderId) => { try { await request('/dispatches', { method: 'POST', body: JSON.stringify({ salesOrderId, dispatchDate: new Date().toISOString() }) }); setNotice('Sales order dispatched.'); load() } catch (err) { setNotice(err.message) } }
  const acceptQuotation = async (id) => { try { await request(`/quotations/${id}`, { method: 'PUT', body: JSON.stringify({ status: 'ACCEPTED' }) }); setNotice('Quotation accepted.'); load() } catch (err) { setNotice(err.message) } }
  const nav = [{ id: 'overview', label: 'Overview' }, { id: 'enquiries', label: 'Enquiries' }, { id: 'quotations', label: 'Quotations' }, { id: 'orders', label: 'Sales orders' }]
  const currentTitle = nav.find((item) => item.id === view)?.label || 'Overview'

  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">F</span><span>FundsRoom</span></div><div className="side-label">WORKSPACE</div><nav>{nav.map((item) => <button className={view === item.id ? 'active' : ''} key={item.id} onClick={() => setView(item.id)}><span className="nav-dot" />{item.label}</button>)}</nav><div className="sidebar-bottom"><div className="user-chip"><span>{user.fullName?.slice(0, 1) || 'A'}</span><div><b>{user.fullName || 'Administrator'}</b><small>{user.role}</small></div></div><button className="signout" onClick={signOut}>Sign out</button></div></aside><main className="content"><header><div><span className="eyebrow">Thursday, 17 September 2026</span><h1>{currentTitle}</h1></div><div className="header-status"><span className="status-dot" />System online</div></header>{notice && <div className="notice" onClick={() => setNotice('')}>{notice}<button>--</button></div>}{view === 'overview' && <Overview data={data} setView={setView} />}{view === 'enquiries' && <Enquiries data={data} form={enquiry} setForm={setEnquiry} submit={submitEnquiry} />}{view === 'quotations' && <Quotations data={data} form={quotation} setForm={setQuotation} submit={submitQuotation} accept={acceptQuotation} />}{view === 'orders' && <OrdersPanel data={data} form={order} setForm={setOrder} submit={submitOrder} reserve={reserveOrder} dispatch={dispatchOrder} isAdmin={user.role === 'ADMIN'} />}</main></div>
}

function Overview({ data, setView }) { const cards = [['Enquiries', data.enquiries.length, 'enquiries'], ['Quotations', data.quotations.length, 'quotations'], ['Sales orders', data.orders.length, 'orders'], ['Available units', data.inventory.reduce((sum, item) => sum + item.availableQuantity, 0), 'orders']]; return <><section className="hero-row"><div><span className="kicker">CONTROL ROOM</span><h2>A clear view of work<br />in motion.</h2><p>Track demand, pricing, commitments and stock from one place.</p></div><div className="hero-stamp"><span>FLOW</span><strong>01 - 04</strong><small>Enquiry to dispatch</small></div></section><section className="stat-grid">{cards.map(([label, value, target]) => <button key={label} onClick={() => setView(target)} className="stat-card"><span>{label}</span><strong>{value}</strong><small>View workspace -&gt;</small></button>)}</section><section className="lower-grid"><div className="panel"><div className="panel-head"><div><span className="eyebrow">PIPELINE</span><h3>Recent enquiries</h3></div><button className="text-button" onClick={() => setView('enquiries')}>View all -&gt;</button></div>{data.enquiries.slice(0, 4).map((item) => <div className="list-row" key={item.id}><span className="row-icon">E</span><div><b>{item.enquiryNumber}</b><small>{item.customer?.name || 'Customer enquiry'}</small></div><span className={`pill ${item.status.toLowerCase()}`}>{item.status}</span></div>)}{!data.enquiries.length && <Empty text="No enquiries yet" />}</div><div className="panel dark-panel"><span className="eyebrow">INVENTORY PULSE</span><h3>Available stock</h3><div className="big-number">{data.inventory.reduce((sum, item) => sum + item.availableQuantity, 0)}</div><p>units currently available across tracked products</p><div className="bar"><i style={{ width: `${Math.min(100, data.inventory.reduce((sum, item) => sum + item.availableQuantity, 0) * 5)}%` }} /></div></div></section></> }

function Enquiries({ data, form, setForm, submit }) { return <section className="workspace-grid"><div className="panel form-panel"><span className="eyebrow">NEW RECORD</span><h3>Create enquiry</h3><form onSubmit={submit}><Field label="Enquiry number"><input required value={form.enquiryNumber} onChange={(e) => setForm({ ...form, enquiryNumber: e.target.value })} placeholder="ENQ-004" /></Field><Field label="Customer"><select required value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}><option value="">Select customer</option>{data.customers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Owner employee"><select required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}><option value="">Select employee</option><option value="fcce9bc1-d4ce-475b-b015-25d57249d6ab">Sales Executive</option></select></Field><button className="primary" type="submit">Create enquiry <span>---</span></button></form></div><div className="panel table-panel"><div className="panel-head"><div><span className="eyebrow">PIPELINE</span><h3>Enquiries</h3></div><span className="count-label">{data.enquiries.length} total</span></div><div className="table-head"><span>Reference</span><span>Customer</span><span>Status</span></div>{data.enquiries.map((item) => <div className="table-row" key={item.id}><b>{item.enquiryNumber}</b><span>{item.customer?.name || '---'}</span><span className={`pill ${item.status.toLowerCase()}`}>{item.status}</span></div>)}{!data.enquiries.length && <Empty text="Your enquiry pipeline is empty" />}</div></section> }

function Quotations({ data, form, setForm, submit, accept }) { return <section className="workspace-grid"><div className="panel form-panel"><span className="eyebrow">PRICING DESK</span><h3>Build quotation</h3><form onSubmit={submit}><Field label="Quotation number"><input required value={form.quotationNumber} onChange={(e) => setForm({ ...form, quotationNumber: e.target.value })} placeholder="QT-004" /></Field><Field label="Enquiry"><select required value={form.enquiryId} onChange={(e) => { const enquiry = data.enquiries.find((item) => item.id === e.target.value); setForm({ ...form, enquiryId: e.target.value, customerId: enquiry?.customerId || '' }) }}><option value="">Select enquiry</option>{data.enquiries.map((item) => <option key={item.id} value={item.id}>{item.enquiryNumber}</option>)}</select></Field><Field label="Employee"><select required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}><option value="">Select employee</option><option value="fcce9bc1-d4ce-475b-b015-25d57249d6ab">Sales Executive</option></select></Field><Field label="Product"><select required value={form.productId} onChange={(e) => { const product = data.products.find((item) => item.id === e.target.value); setForm({ ...form, productId: e.target.value, unitPrice: product?.price || 0 }) }}><option value="">Select product</option>{data.products.map((item) => <option key={item.id} value={item.id}>{item.name} -- ---{item.price}</option>)}</select></Field><div className="two-col"><Field label="Quantity"><input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></Field><Field label="Discount"><input type="number" min="0" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></Field></div><button className="primary" type="submit">Create quotation <span>---</span></button></form></div><div className="panel table-panel"><div className="panel-head"><div><span className="eyebrow">COMMERCIALS</span><h3>Quotations</h3></div></div><div className="table-head"><span>Reference</span><span>Grand total</span><span>Action</span></div>{data.quotations.map((item) => <div className="table-row" key={item.id}><b>{item.quotationNumber}</b><span>---{item.grandTotal.toLocaleString()}</span>{item.status === 'DRAFT' || item.status === 'SENT' ? <button className="mini-button" onClick={() => accept(item.id)}>Accept</button> : <span className={`pill ${item.status.toLowerCase()}`}>{item.status}</span>}</div>)}{!data.quotations.length && <Empty text="No quotations yet" />}</div></section> }

function Orders({ data, form, setForm, submit }) { return <section className="workspace-grid"><div className="panel form-panel"><span className="eyebrow">ORDER DESK</span><h3>Convert quotation</h3><p className="muted">Only accepted quotations can become sales orders.</p><form onSubmit={submit}><Field label="Order number"><input required value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} placeholder="SO-004" /></Field><Field label="Accepted quotation"><select required value={form.quotationId} onChange={(e) => setForm({ ...form, quotationId: e.target.value })}><option value="">Select accepted quotation</option>{data.quotations.filter((item) => item.status === 'ACCEPTED').map((item) => <option key={item.id} value={item.id}>{item.quotationNumber} -- ---{item.grandTotal.toLocaleString()}</option>)}</select></Field><button className="primary" type="submit">Create sales order <span>---</span></button></form></div><div className="panel table-panel"><div className="panel-head"><div><span className="eyebrow">FULFILMENT</span><h3>Sales orders</h3></div></div><div className="table-head"><span>Reference</span><span>Quotation</span><span>Status</span></div>{data.orders.map((item) => <div className="table-row" key={item.id}><b>{item.orderNumber}</b><span>{item.quotation?.quotationNumber || '---'}</span><span className={`pill ${item.status.toLowerCase()}`}>{item.status}</span></div>)}{!data.orders.length && <Empty text="No orders yet" />}</div></section> }
function Field({ label, children }) { return <label className="field">{label}{children}</label> }
function Empty({ text }) { return <div className="empty">{text}</div> }

export default App


