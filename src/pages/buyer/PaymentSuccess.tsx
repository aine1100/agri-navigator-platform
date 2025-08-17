import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface OrderDetails {
  id: number;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  orderDate: string;
  carts: Array<{
    livestock: {
      type: string;
      breed: string;
      price: number;
      totalPrice:number;
    };
    quantity: number;
    totalPrice: number;
  }>;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>("Verifying payment...");

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        if (!orderId) {
          setVerificationStatus("Order ID not found in URL.");
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`https://hingabackend-production.up.railway.app/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch order details: ${response.status} ${response.statusText} - ${errorData.message || ''}`);
        }

        const orderData = await response.json();
        setOrderDetails(orderData);

        console.log(orderData)

        if (orderData.paymentStatus === "PAID") {
          setVerificationStatus("Payment Successful! Your order has been confirmed.");
          toast({
            title: "Payment Successful!",
            description: "Your order has been confirmed and will be processed shortly.",
          });
        } else {
          setVerificationStatus(`Payment Status: ${orderData.paymentStatus}. Please check your order details.`);
          toast({
            title: "Payment Status",
            description: `Current status: ${orderData.paymentStatus}`,
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error verifying payment status:", error);
        setVerificationStatus("Error verifying payment status.");
        toast({
          title: "Error",
          description: "There was an error verifying your payment. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentStatus();
  }, [orderId, navigate, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Verifying payment...</span>
      </div>
    );
  }

  const formatAmount = (amount: number | undefined) => {
    if (amount === undefined) return "0.00";
    return amount.toFixed(2);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {orderDetails?.paymentStatus === "PAID" ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <AlertCircle className="h-16 w-16 text-yellow-500" />
            )}
          </div>
          <CardTitle className="text-center text-2xl">
            {orderDetails?.paymentStatus === "PAID" ? "Payment Successful!" : "Payment Status"}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderDetails && (
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                Order ID: {orderDetails.id || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Total Amount: ${formatAmount(orderDetails.carts.reduce((acc, cart) => acc + cart.totalPrice, 0))}
              </p>
              <p className="text-sm text-gray-500">
                Order Date: {formatDate(orderDetails.orderDate)}
              </p>
              <p className="text-sm text-gray-500">
                Status: {orderDetails.orderStatus || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Payment Status: {orderDetails.paymentStatus || "N/A"}
              </p>
            </div>
          )}
          <div className="text-center text-sm text-gray-500">
            <p>We will process your order shortly.</p>
            <p>You will receive an email confirmation with your order details.</p>
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/buyer/orders")}
            >
              View Orders
            </Button>
            <Button
              onClick={() => navigate("/buyer/dashboard")}
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess; 