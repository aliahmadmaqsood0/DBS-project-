import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { calculateInvoiceAmount, getInvoicesForUser } from '../data/helpers';

export default function Billing() {
  const { currentUser } = useAuth();
  const { invoices, payments, BILLING_RATES, updateInvoice, addPayment } = useData();
  const isAdmin = currentUser?.Role === 'Admin';

  const userInvoices = isAdmin ? invoices : getInvoicesForUser(currentUser);
  const totalRev = userInvoices.reduce((sum, inv) => sum + calculateInvoiceAmount(inv.ShipmentID).total, 0);
  const pendingAmt = userInvoices.filter(i => i.Status === 'Pending').reduce((sum, inv) => sum + calculateInvoiceAmount(inv.ShipmentID).total, 0);

  const handleMarkPaid = (inv) => {
    updateInvoice(inv.InvoiceID, { Status: 'Paid' });
    const billing = calculateInvoiceAmount(inv.ShipmentID);
    addPayment({ InvoiceID: inv.InvoiceID, Amount: billing.total, PaymentDate: new Date().toISOString().split('T')[0], Method: 'Online Payment', Status: 'Confirmed' });
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="page-hero">
        <img src="/images/billing_finance.png" alt="Billing" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h2>💰 Billing & Invoices</h2>
            <p>Dynamic billing — Amount = Σ(days × rate per container size)</p>
          </div>
        </div>
        <div className="hero-3d">
          <img src="/images/billing_finance.png" alt="" />
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-icon green">💰</div><div><div className="stat-value">${totalRev.toLocaleString()}</div><div className="stat-label">Total Revenue</div></div></div>
        <div className="stat-card"><div className="stat-icon amber">⏳</div><div><div className="stat-value">${pendingAmt.toLocaleString()}</div><div className="stat-label">Pending Amount</div></div></div>
        <div className="stat-card"><div className="stat-icon blue">📄</div><div><div className="stat-value">{userInvoices.length}</div><div className="stat-label">Total Invoices</div></div></div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><h3>Rate Schedule</h3></div>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {Object.entries(BILLING_RATES).map(([size, rate], idx) => (
            <div key={size} style={{ background: 'rgba(59,130,246,0.06)', padding: '16px 24px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(59,130,246,0.12)', animation: `popIn .3s ease backwards`, animationDelay: `${idx * 0.1}s`, transition: 'var(--transition)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{size} Container</div>
              <div style={{ fontSize: 26, fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>${rate}<span style={{ fontSize: 12, fontWeight: 400, WebkitTextFillColor: 'var(--text-muted)' }}>/day</span></div>
            </div>
          ))}
        </div>
      </div>

      {userInvoices.map((inv, idx) => {
        const billing = calculateInvoiceAmount(inv.ShipmentID);
        const pays = payments.filter(p => p.InvoiceID === inv.InvoiceID);
        return (
          <div className="card" key={inv.InvoiceID} style={{ marginBottom: 22, animationDelay: `${idx * 0.1}s` }}>
            <div className="card-header">
              <h3>{inv.InvoiceID} — Shipment {inv.ShipmentID}</h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`badge ${inv.Status.toLowerCase()}`}>{inv.Status}</span>
                {isAdmin && inv.Status === 'Pending' && (
                  <button className="btn btn-xs btn-success" onClick={() => handleMarkPaid(inv)}>✓ Mark Paid</button>
                )}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Invoice ID</div><div style={{ fontWeight: 600 }}>{inv.InvoiceID}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Shipment (FK)</div><div style={{ fontWeight: 600, color: '#a78bfa' }}>{inv.ShipmentID}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Issue Date</div><div>{inv.IssueDate}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Due Date</div><div>{inv.DueDate}</div></div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', marginBottom: 10 }}>📊 Billing Breakdown</div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Container</th><th>Size</th><th>Assigned</th><th>Released</th><th>Days</th><th>Rate/Day</th><th>Cost</th></tr></thead>
                <tbody>
                  {billing.breakdown.map((b, i) => (
                    <tr key={b.containerID} style={{ animation: `slideInLeft .3s ease backwards`, animationDelay: `${i * 0.05}s` }}>
                      <td style={{ color: 'var(--accent)' }}>{b.containerID}</td>
                      <td>{b.size}</td><td>{b.assignedDate}</td><td>{b.releasedDate}</td>
                      <td style={{ fontWeight: 600 }}>{b.days}</td><td>${b.rate}</td>
                      <td style={{ fontWeight: 700, color: '#34d399' }}>${b.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ textAlign: 'right', fontSize: 24, fontWeight: 900, marginTop: 14, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Total: ${billing.total.toLocaleString()}
            </div>

            {pays.length > 0 && (
              <div style={{ marginTop: 18, borderTop: '1px solid var(--border)', paddingTop: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>💳 Payments</div>
                {pays.map(p => (
                  <div key={p.PaymentID} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                    <span style={{ color: 'var(--accent)' }}>{p.PaymentID}</span>
                    <span>${p.Amount.toLocaleString()}</span>
                    <span>{p.PaymentDate}</span>
                    <span>{p.Method}</span>
                    <span className={`badge ${p.Status.toLowerCase()}`}>{p.Status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
