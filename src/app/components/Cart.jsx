import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export const generateCartItemsFrom = (cartData, productsData) => {
  const result = [];
  cartData = typeof cartData == "string" ? JSON.parse(cartData) : cartData;
  for (let cartItem of cartData) {
    const data = productsData.find(
      (product) => product.id == cartItem.productId
    );
    const modifiedData = { ...data, qty: `${cartItem.quantity}` };
    result.push(modifiedData);
  }

  console.log("result >>", result);
  return result;
};

export const getTotalCartValue = (items = []) => {
  // console.log("total cartvalue>>> ", items);
  const totalCartValue = items.reduce(
    (acc, item) => acc + item.price * (item.qty * 1),
    0
  );

  return totalCartValue;
};

export const getTotalItems = (items = []) => {
  const totalCartItems = items.reduce((acc, item) => acc + item.qty * 1, 0);
  // console.log(totalCartItems);
  return totalCartItems;
};

const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  // console.log("isReadOnly >> ", isReadOnly);
  return (
    <Stack direction="row" alignItems="center">
      {isReadOnly ? (
        ""
      ) : (
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
      )}
      <Box padding="0.5rem" data-testid="item-qty">
        {isReadOnly ? "Qty: " : ""}
        {value}
      </Box>
      {isReadOnly ? (
        ""
      ) : (
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      )}
    </Stack>
  );
};

const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  const history = useRouter();
  const token = localStorage.getItem("loggedIn");

  console.log("items>>> ", items);

  if (!items.length) {
    return (
      <Box className="cart empty flex flex-col justify-center items-center min-h-[60vh]">
        <ShoppingCartOutlined className="empty-cart-icon w-[3rem] h-[3rem] text-[#aaa]" />
        <Box color="#aaa" textAlign="center" p={1}>
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart bg-white rounded m-2">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((item) => (
          <Box
            display="flex"
            alignItems="flex-start"
            padding="1rem"
            key={item.id}
          >
            <Box className="image-container max-h-[10rem] max-w-[8rem]">
              <img
                src={item.image}
                alt={item.name}
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{item.title}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ItemQuantity
                  // Add required props by checking implementation
                  value={item.qty}
                  handleAdd={async () => {
                    await handleQuantity(
                      token,
                      items,
                      products,
                      item.id,
                      item.qty * 1 + 1
                    );
                  }}
                  handleDelete={async () => {
                    await handleQuantity(
                      token,
                      items,
                      products,
                      item.id,
                      item.qty * 1 - 1
                    );
                  }}
                  isReadOnly={isReadOnly}
                />
                <Box padding="0.5rem" fontWeight="700">
                  ${item.price}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {isReadOnly ? (
          ""
        ) : (
          <Box
            display="flex"
            justifyContent="flex-end"
            className="cart-footer p-4"
          >
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn font-[700] text-[1.1rem] normal-case"
              onClick={() => history.push("/checkout")}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>

      {isReadOnly ? (
        <Box className="cart" padding="1rem">
          <h2>Order Details</h2>
          <Box className="cart-row flex items-center justify-between">
            <p>Products</p>
            <p>{getTotalItems(items)}</p>
          </Box>
          <Box className="cart-row flex items-center justify-between">
            <p>Subtotal</p>
            <p>${getTotalCartValue(items)}</p>
          </Box>
          <Box className="cart-row flex items-center justify-between">
            <p>Shipping Charges</p>
            <p>$0</p>
          </Box>
          <Box
            className="cart-row flex items-center justify-between"
            fontSize="1.25rem"
            fontWeight="700"
          >
            <p>Total</p>
            <p>${getTotalCartValue(items)}</p>
          </Box>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

export default Cart;
