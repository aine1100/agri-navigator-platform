import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      // Log the cancellation for tracking purposes
      console.log("Payment cancelled for session:", sessionId);
      
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. No charges were made.",
        variant: "destructive",
      });
    }
  }, [sessionId, toast]);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-center text-2xl">Payment Cancelled</CardTitle>
          <CardDescription className="text-center">
            Your payment was cancelled. No charges were made.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-500">
            <p>You can try the payment again or contact support if you need assistance.</p>
            {sessionId && (
              <p className="mt-2 text-xs text-gray-400">
                Session ID: {sessionId}
              </p>
            )}
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/buyer/orders")}
            >
              Back to Orders
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

export default PaymentCancel; 