import { useState } from 'react'

function Field({ label, children }) {
  return <label className="field">{label}{children}</label>
}

function OrdersPanel({ data, form, setForm, submit, reserve, dispatch, isAdmin }) {
  const [inventoryId, setInventoryId] = useState(data.inventory[0]?.id || '')
  const [quantity, setQuantity] = useState(1)

  return <section className="workspace-grid">
    <div className="panel form-panel">
      <span className="eyebrow">ORDER DESK</span>
      <h3>Convert quotation</h3>
      <p className="muted">Only accepted quotations can become sales orders.</p>
      <form onSubmit={submit}>
        <Field label="Order number"><input required value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} placeholder="SO-004" /></Field>
        <Field label="Accepted quotation"><select required value={form.quotationId} onChange={(e) => setForm({ ...form, quotationId: e.target.value })}><option value="">Select accepted quotation</option>{data.quotations.filter((item) => item.status === 'ACCEPTED').map((item) => <option key={item.id} value={item.id}>{item.quotationNumber} - {item.grandTotal.toLocaleString()}</option>)}</select></Field>
        <button className="primary" type="submit">Create sales order <span>-&gt;</span></button>
      </form>
      {isAdmin && <div className="reservation-box"><span className="eyebrow">RESERVE STOCK</span><Field label="Inventory"><select value={inventoryId} onChange={(e) => setInventoryId(e.target.value)}>{data.inventory.map((item) => <option key={item.id} value={item.id}>{item.product?.name || item.productId} - available {item.availableQuantity}</option>)}</select></Field><Field label="Quantity"><input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></Field></div>}
    </div>
    <div className="panel table-panel">
      <div className="panel-head"><div><span className="eyebrow">FULFILMENT</span><h3>Sales orders</h3></div></div>
      <div className="table-head"><span>Reference</span><span>Status</span><span>Actions</span></div>
      {data.orders.map((item) => <div className="table-row order-row" key={item.id}><div><b>{item.orderNumber}</b><small>{item.quotation?.quotationNumber || 'No quotation'}</small></div><span className={`pill ${item.status.toLowerCase()}`}>{item.status}</span><div className="row-actions">{isAdmin && item.status === 'CREATED' && <button className="mini-button" onClick={() => reserve(item.id, inventoryId, quantity)}>Reserve</button>}{isAdmin && item.status === 'RESERVED' && <button className="mini-button" onClick={() => dispatch(item.id)}>Dispatch</button>}{item.status === 'DISPATCHED' && <span className="done">Complete</span>}</div></div>)}
      {!data.orders.length && <div className="empty">No orders yet</div>}
    </div>
  </section>
}

export default OrdersPanel
