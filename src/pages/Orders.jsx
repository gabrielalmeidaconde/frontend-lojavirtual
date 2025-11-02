import './Orders.css';

const Orders = () => {
  return (
    <div className="orders-page">
      <div className="no-orders">
        <span className="no-orders-icon">📦</span>
        <h2>Nenhum pedido encontrado</h2>
        <p>Você ainda não realizou nenhuma compra.</p>
        <p style={{ marginTop: '1rem', color: '#636e72', fontSize: '0.9rem' }}>
          (Sistema de pedidos em desenvolvimento)
        </p>
      </div>
    </div>
  );
};

export default Orders;
