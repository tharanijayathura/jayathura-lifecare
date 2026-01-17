import { useState, useEffect } from 'react';
import { patientAPI } from '../../../services/api';
import API from '../../../services/api';

export const usePatientPortal = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [shopTab, setShopTab] = useState(0);
  const [latestPrescription, setLatestPrescription] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [prescriptionOrders, setPrescriptionOrders] = useState([]);
  const [billReviewOpen, setBillReviewOpen] = useState(false);
  const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);
  const [addItemsDialogOpen, setAddItemsDialogOpen] = useState(false);
  const [selectedPrescriptionOrderId, setSelectedPrescriptionOrderId] = useState(null);

  const handleAddToCart = async (item) => {
    try {
      setLoading(true);
      let orderId = currentOrderId;
      if (!orderId) {
        const orderResponse = await patientAPI.createOrder();
        orderId = orderResponse.data._id;
        setCurrentOrderId(orderId);
      }
      const response = await patientAPI.addToCart({ orderId, medicineId: item.itemId, quantity: item.quantity || 1 });
      if (response.data?.order) {
        const seenItems = new Map();
        const orderItems = (response.data.order.items || [])
          .map(orderItem => {
            const itemId = orderItem.medicineId?._id || orderItem.medicineId;
            const orderItemId = orderItem._id?.toString();
            const uniqueKey = orderItemId || itemId?.toString();
            if (seenItems.has(uniqueKey)) return null;
            seenItems.set(uniqueKey, true);
            return {
              itemId,
              name: orderItem.medicineName || orderItem.medicineId?.name,
              price: orderItem.price || 0,
              quantity: orderItem.quantity || 1,
              itemType: orderItem.isPrescription ? 'Prescription' : 'Non Prescription',
              image: orderItem.medicineId?.image,
              orderItemId: orderItem._id,
              uniqueKey,
            };
          })
          .filter(Boolean);
        setCartItems(orderItems);
      } else {
        setCartItems((prev) => {
          const existing = prev.find((cartItem) => cartItem.itemId === item.itemId && cartItem.itemType === item.itemType);
          if (existing) {
            return prev.map((cartItem) => cartItem.itemId === item.itemId && cartItem.itemType === item.itemType ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
          }
          return [...prev, item];
        });
      }
      setOrderStatus('');
      setSnackbar({ open: true, message: `${item.name} added to cart successfully!`, severity: 'success' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({ open: true, message: error.response?.data?.message || 'Error adding item to cart. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (index) => {
    const item = cartItems[index];
    try {
      if (currentOrderId && item.orderItemId) {
        await patientAPI.removeOrderItem(currentOrderId, item.orderItemId);
        const orderResponse = await patientAPI.getOrderStatus(currentOrderId);
        if (orderResponse.data?.items) {
          const seenItems = new Map();
          const orderItems = orderResponse.data.items
            .map(orderItem => {
              const itemId = orderItem.medicineId?._id || orderItem.medicineId;
              const orderItemId = orderItem._id?.toString();
              const uniqueKey = orderItemId || itemId?.toString();
              if (seenItems.has(uniqueKey)) return null;
              seenItems.set(uniqueKey, true);
              return {
                itemId,
                name: orderItem.medicineName || orderItem.medicineId?.name,
                price: orderItem.price || 0,
                quantity: orderItem.quantity || 1,
                itemType: orderItem.isPrescription ? 'Prescription' : 'Non Prescription',
                image: orderItem.medicineId?.image,
                orderItemId: orderItem._id,
                uniqueKey,
              };
            })
            .filter(Boolean);
          setCartItems(orderItems);
        } else {
          setCartItems((prev) => prev.filter((_, i) => i !== index));
        }
      } else {
        setCartItems((prev) => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setCartItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleOrderSubmit = async ({ attachPrescription, paymentMethod = 'online' }) => {
    if (cartItems.length === 0 || !currentOrderId) return;
    try {
      setLoading(true);
      const orderResponse = await patientAPI.getOrderStatus(currentOrderId);
      const order = orderResponse.data;
      if (order.prescriptionId && order.status === 'draft') {
        await patientAPI.sendOrderToPharmacist(currentOrderId);
        setSnackbar({ open: true, message: 'Order sent to pharmacist! They will review your prescription and add medicines. You will receive a bill to review.', severity: 'success' });
        setCartItems([]);
        setCurrentOrderId(null);
        fetchPrescriptionOrders();
        return;
      }
      if (order.finalAmount || order.status === 'pending') {
        setSelectedOrderForBill(currentOrderId);
        setBillReviewOpen(true);
        setLoading(false);
        return;
      }
      await API.post(`/orders/${currentOrderId}/generate-bill`);
      setSelectedOrderForBill(currentOrderId);
      setBillReviewOpen(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit order. Please try again.';
      setOrderStatus(`Error: ${errorMessage}`);
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionUploaded = async (prescriptionMeta) => {
    setLatestPrescription(prescriptionMeta);
    if (prescriptionMeta.orderId) {
      setCurrentOrderId(prescriptionMeta.orderId);
      setSnackbar({ open: true, message: 'Prescription uploaded! Add optional items or send directly to pharmacist.', severity: 'success' });
      fetchPrescriptionOrders();
      setSelectedPrescriptionOrderId(prescriptionMeta.orderId);
      setAddItemsDialogOpen(true);
    } else {
      try {
        const response = await patientAPI.getPrescriptionOrders();
        const orders = response.data || [];
        const latestOrder = orders.find(order => order.prescriptionId && order.status === 'draft') || orders[0];
        if (latestOrder) {
          setCurrentOrderId(latestOrder._id);
          setPrescriptionOrders(orders);
          setSnackbar({ open: true, message: 'Prescription uploaded! You can now add non prescription items to this order.', severity: 'success' });
          setTimeout(() => { setActiveTab(2); }, 1500);
        }
      } catch (error) {
        console.error('Error fetching prescription order:', error);
      }
    }
  };

  const fetchPrescriptionOrders = async () => {
    try {
      const response = await patientAPI.getPrescriptionOrders();
      setPrescriptionOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching prescription orders:', error);
    }
  };

  const handleViewBill = (order) => {
    setSelectedOrderForBill(order);
    setBillReviewOpen(true);
  };

  const handleBillConfirmed = async (orderData) => {
    setSnackbar({ open: true, message: 'Order confirmed successfully! You will receive updates on your order status.', severity: 'success' });
    setCartItems([]);
    setCurrentOrderId(null);
    setBillReviewOpen(false);
    setSelectedOrderForBill(null);
    fetchPrescriptionOrders();
  };

  useEffect(() => {
    const checkAndClearInvalidOrder = async () => {
      if (currentOrderId) {
        try {
          const orderResponse = await patientAPI.getOrderStatus(currentOrderId);
          const order = orderResponse.data;
          if (!order || (order.status !== 'draft' && order.status !== 'pending')) {
            setCurrentOrderId(null);
            setCartItems([]);
          }
        } catch (error) {
          setCurrentOrderId(null);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };
    checkAndClearInvalidOrder();
  }, []);

  useEffect(() => {
    const loadCartFromOrder = async () => {
      if (currentOrderId) {
        try {
          const orderResponse = await patientAPI.getOrderStatus(currentOrderId);
          const order = orderResponse.data;
          if (order && (order.status === 'draft' || order.status === 'pending')) {
            if (order.items && order.items.length > 0) {
              const seenItems = new Map();
              const orderItems = order.items
                .map(orderItem => {
                  const itemId = orderItem.medicineId?._id || orderItem.medicineId;
                  const orderItemId = orderItem._id?.toString();
                  const uniqueKey = orderItemId || itemId?.toString();
                  if (seenItems.has(uniqueKey)) return null;
                  seenItems.set(uniqueKey, true);
                  return {
                    itemId,
                    name: orderItem.medicineName || orderItem.medicineId?.name,
                    price: orderItem.price || 0,
                    quantity: orderItem.quantity || 1,
                    itemType: orderItem.isPrescription ? 'Prescription' : 'Non Prescription',
                    image: orderItem.medicineId?.image,
                    orderItemId: orderItem._id,
                    uniqueKey,
                  };
                })
                .filter(Boolean);
              setCartItems(orderItems);
            } else {
              setCartItems([]);
            }
          } else {
            setCartItems([]);
            setCurrentOrderId(null);
          }
        } catch (error) {
          console.error('Error loading cart from order:', error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };
    loadCartFromOrder();
  }, [currentOrderId]);

  return {
    activeTab,
    setActiveTab,
    cartItems,
    setCartItems,
    shopTab,
    setShopTab,
    latestPrescription,
    setLatestPrescription,
    orderStatus,
    setOrderStatus,
    currentOrderId,
    setCurrentOrderId,
    loading,
    setLoading,
    snackbar,
    setSnackbar,
    prescriptionOrders,
    setPrescriptionOrders,
    billReviewOpen,
    setBillReviewOpen,
    selectedOrderForBill,
    setSelectedOrderForBill,
    addItemsDialogOpen,
    setAddItemsDialogOpen,
    selectedPrescriptionOrderId,
    setSelectedPrescriptionOrderId,
    handleAddToCart,
    handleRemoveItem,
    handleOrderSubmit,
    handlePrescriptionUploaded,
    fetchPrescriptionOrders,
    handleViewBill,
    handleBillConfirmed,
  };
};
