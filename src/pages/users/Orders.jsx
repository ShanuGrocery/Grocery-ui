import React, { useEffect, useState, useRef } from 'react';
import { getUserOrders, getUserOrderById } from '../../services/orderApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const detailsRef = useRef(null);

  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      getUserOrders()
        .then((data) => {
          setOrders(data || []);
        })
        .catch(() => {
          toast.error('Failed to fetch orders');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, authLoading]);

  const handleOrderClick = (orderId) => {
    setDetailsLoading(true);
    getUserOrderById(orderId)
      .then((data) => {
        setSelectedOrder(data);
      })
      .catch(() => {
        toast.error('Failed to fetch order details');
      })
      .finally(() => {
        setDetailsLoading(false);
      });
  };

  // ✅ Smooth scroll when order details load
  useEffect(() => {
    if (selectedOrder && detailsRef.current) {
      detailsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [selectedOrder]);

  if (authLoading) return <p className="text-center py-10">Checking authentication...</p>;
  if (loading) return <p className="text-center py-10">Loading your orders...</p>;

  if (!orders.length) {
    return (
      <section className="max-w-5xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-green-600 mb-4">My Orders</h2>
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">

      <h2 className="text-3xl font-bold text-green-600 mb-6">
        My Orders
      </h2>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-green-600 text-white sticky top-0">

              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Item</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Amount</th>
              </tr>

            </thead>

            <tbody className="divide-y">

              {orders.map((order, idx) => (

                <tr
                  key={order._id}
                  className="hover:bg-green-50 cursor-pointer transition"
                  onClick={() => handleOrderClick(order._id)}
                >

                  <td className="px-6 py-4 font-semibold">{idx + 1}</td>

                  <td className="px-6 py-4">

                    {order.items && order.items.length > 0 ? (

                      order.items[0].product
                        ? order.items[0].product.name
                        : `Variant @ ₹${order.items[0].selectedVariant.price}`

                    ) : (

                      'No items'

                    )}

                  </td>

                  <td className="px-6 py-4 text-gray-600">

                    {order.placedAt
                      ? new Date(order.placedAt).toLocaleDateString()
                      : order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : 'N/A'}

                  </td>

                  <td className="px-6 py-4 font-semibold text-green-700">

                    ₹{(order.totalAmount - (order.discountAmount || 0)).toFixed(2)}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {detailsLoading && (
        <p className="text-center mt-6">Loading order details...</p>
      )}

      {selectedOrder && !detailsLoading && (

        <section
          ref={detailsRef}
          className="mt-8 bg-white border rounded-2xl shadow-lg p-6"
        >

          <h3 className="text-2xl font-bold text-green-700 mb-6">
            Order Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">

            <div className="space-y-2">

              <p><span className="font-semibold">Order ID:</span> {selectedOrder._id}</p>

              <p>
                <span className="font-semibold">Status:</span>
                <span className={`ml-2 px-3 py-1 text-xs rounded-full text-white ${
                  selectedOrder.orderStatus === 'Delivered'
                    ? 'bg-green-600'
                    : selectedOrder.orderStatus === 'Pending'
                    ? 'bg-yellow-500'
                    : 'bg-gray-500'
                }`}>
                  {selectedOrder.orderStatus}
                </span>
              </p>

              <p>
                <span className="font-semibold">Payment Status:</span> {selectedOrder.paymentStatus}
              </p>

              <p>
                <span className="font-semibold">Payment Method:</span> {selectedOrder.paymentMethod}
              </p>

            </div>

            <div>

              <p className="font-semibold mb-2">Shipping Address</p>

              <div className="bg-gray-50 p-3 rounded-lg border text-sm leading-relaxed">

                {selectedOrder.shippingAddress.fullName}<br/>

                {selectedOrder.shippingAddress.addressLine1}<br/>

                {selectedOrder.shippingAddress.addressLine2 && (
                  <>
                    {selectedOrder.shippingAddress.addressLine2}<br/>
                  </>
                )}

                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pinCode}<br/>

                {selectedOrder.shippingAddress.country}

              </div>

            </div>

          </div>

          <div className="mt-8">

            <h4 className="text-lg font-semibold text-green-700 mb-4">
              Ordered Items
            </h4>

            <div className="space-y-4">

              {selectedOrder.items.map((item, i) => (

                <div
                  key={i}
                  className="flex justify-between items-center border rounded-lg p-4 hover:bg-gray-50"
                >

                  <div>

                    <p className="font-semibold">

                      {item.product ? item.product.name : 'Unnamed product'}

                    </p>

                    <p className="text-sm text-gray-500">

                      {item.selectedVariant.unit} • {item.selectedVariant.packaging}

                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm">Qty: {item.quantity}</p>

                    <p className="font-bold text-green-700">

                      ₹{(item.selectedVariant.price * item.quantity).toFixed(2)}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

          <div className="mt-6 border-t pt-4 flex justify-end gap-6 text-lg font-semibold">

            <p>
              Total: <span className="text-green-700">₹{selectedOrder.totalAmount.toFixed(2)}</span>
            </p>

            {selectedOrder.discountAmount > 0 && (

              <p className="text-red-600">

                Discount: -₹{selectedOrder.discountAmount.toFixed(2)}

              </p>

            )}

          </div>

        </section>

      )}

    </section>
  );
};

export default Orders;