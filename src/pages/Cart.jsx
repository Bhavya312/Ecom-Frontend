import { Button } from "../components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../components/ui/input";
import { api, post } from "../components/config/config";
import { updateCart } from "../redux/api/cartSlice";

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (cart && cart.products) {
      setCartItems(cart.products);
    }
  }, [cart]);

  const removeItem = async (id) => {
    if (cart) {
      const formData = {
        cart_id: cart?.id,
        user_id: userInfo?.user?.id,
        product_id: id,
        quantity: 0,
      };

      const cartUpdate = await post(api.CARTS + "/update", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      dispatch(updateCart(cartUpdate.data.data));
    }
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const quantityUpdate = async (id, quantity, curQuantity) => {
    const formData = {
      product_id: id,
      quantity: parseInt(quantity),
    };

    if (quantity > 0 && quantity != curQuantity) {
      const type = quantity > curQuantity ? 1 : 0;
      formData.cart_id = cart?.id;
      formData.type = type;
      
      const cartUpdate = await post(api.CARTS + "/update", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      dispatch(updateCart(cartUpdate.data.data));
    }
  };

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-2 border-gray-300 p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <Input
                      defaultValue={item.quantity}
                      className="w-16 h-7"
                      min={1}
                      type="number"
                      onBlur={(e) =>
                        quantityUpdate(item.id, e.target.value, item.quantity)
                      }
                    />
                    <p className="text-sm font-medium text-gray-600">
                      ₹{item.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary section */}
          <div className="mt-8 border-t-2 border-gray-300 pt-6 text-right">
            <h4 className="text-xl font-bold">Total: ₹{getTotal()}</h4>
            <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
