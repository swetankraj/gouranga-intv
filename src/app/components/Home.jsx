"use client";

import React, { useEffect, useState } from "react";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Box,
} from "@mui/material";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart";
import { useSnackbar } from "notistack";
export default function Home() {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [timerId, setTimerId] = useState(null);
  const [token, setToken] = useState(null);
  const [items, setItems] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [localStorageToken, setLocalStorageToken] = useState();

  let mdValue = 12;

  if (isClient && localStorage.getItem("loggedIn")) {
    mdValue = 9;
  }

  useEffect(() => {
    if (window !== undefined) {
      setIsClient(true);
      setLocalStorageToken(localStorage.getItem("loggedIn"));
    }

    const fetchData = async () => {
      const productsData = await performAPICall();
      // console.log("performAPICall >>", productsData);
      setLoading(false);
      setProducts(productsData);

      //only runs when logged it.
      setToken(localStorage.getItem("loggedIn"));
      if (localStorage.getItem("loggedIn")) {
        const cartData = await fetchCart(localStorage.getItem("loggedIn"));
        setItems(cartData);
        // console.log("fetchCartCall >>", cartData);

        if (cartData?.length) {
          const completeCartData = generateCartItemsFrom(
            cartData,
            productsData
          );
          setCart(completeCartData);
          // console.log("formatedData>> ", completeCartData);
        }
      }
    };

    fetchData();
  }, []);

  const performAPICall = async () => {
    try {
      const url = "https://fakestoreapi.com/products?limit=8";
      const res = await axios.get(url);
      // const data = await res.json();
      // console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(">", error);
      return [];
    }
  };

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      if (isClient) {
        return JSON.parse(localStorage.getItem("cart"));
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  const updateCartItems = (cartData, products) => {
    const cartItems = generateCartItemsFrom(cartData, products);
    // console.log("mycartitems >> ", cartItems);
    setCart(cartItems);
    console.log("products>>>", products);
    console.log(cartData);
  };

  const isItemInCart = (items, productId) => {
    if (items) {
      items = typeof items == "string" ? JSON.parse(items) : items;
      console.log(items);
      let idx = items.findIndex((item) => {
        // console.log(item.productId, productId);
        return item.productId == productId;
      });
      // console.log(idx);
      return idx !== -1;
    }
  };

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    // console.log(options.preventDuplicate, isItemInCart(items, productId));

    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    } else if (options.preventDuplicate && isItemInCart(items, productId)) {
      console.log("item already in cart");
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
    } else {
      try {
        let response;
        if (isClient) {
          response = localStorage.getItem("cart");
          if (response == undefined) {
            const cart = [
              {
                productId: `${productId}`,
                quantity: qty * 1,
              },
            ];

            localStorage.setItem("cart", JSON.stringify(cart));
            setItems(cart);
          } else {
            let itemFound = false;
            const updatedCart = [];
            const localStorageCart = JSON.parse(response);
            // console.log(localStorageCart);
            localStorageCart.forEach((item) => {
              if (item.productId == productId) {
                itemFound = true;
                const updatedValue = qty;
                const newData = {
                  productId: `${productId}`,
                  quantity: `${updatedValue}`,
                };

                if (updatedValue > 0) updatedCart.push(newData);
              } else updatedCart.push(item);
            });

            if (!itemFound) {
              const newProduct = {
                productId: `${productId}`,
                quantity: qty * 1,
              };
              updatedCart.push(newProduct);
            }

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setItems(updatedCart);
          }
        }
        updateCartItems(JSON.parse(localStorage.getItem("cart")), products);
      } catch (error) {
        if (error.response) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch products. Check that the backend is running, reachable and returns valid JSON",
            { variant: "error" }
          );
        }
      }
    }
  };
  return (
    <div>
      <Header>
        <div className="hidden md:block">
          <TextField
            className=""
            size="small"
            placeholder="Search for items/categories"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            name="search"
            onChange={(e) => debounceSearch(e, timerId)}
          />
        </div>
      </Header>
      <div className="block md:hidden">
        <TextField
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, timerId)}
        />
      </div>
      <Grid container>
        <Grid item md={mdValue}>
          <Grid container>
            <Grid item className="w-full">
              <Box className="hero flex justify-center md:justify-end items-center h-[10rem] md:h-[20rem] md:pr-[8rem]">
                <p className="text-white text-[1.5rem] w-[80%] relative left-[1rem]">
                  India’s{" "}
                  <span className="text-[#212121] font-bold bg-[#ffb825] rounded p-[0.2rem] md:static md:text-[3rem] md:w-[50%]">
                    FASTEST DELIVERY
                  </span>{" "}
                  to your door step
                </p>
              </Box>
            </Grid>
          </Grid>

          {loading ? (
            <Box className="flex flex-col items-center justify-center w-full h-[50vh]">
              <CircularProgress />
              <h4>Loading Products...</h4>
            </Box>
          ) : products.length > 0 ? (
            <Grid container spacing={2} marginY={1} paddingX={1}>
              {products.map((product) => (
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard
                    product={product}
                    handleAddToCart={async () => {
                      await addToCart(
                        localStorageToken,
                        items,
                        products,
                        product.id,
                        1,
                        {
                          preventDuplicate: true,
                        }
                      );
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box className="flex flex-col items-center justify-center w-full h-[50vh]">
              <SentimentDissatisfied />
              <h4>No products found</h4>
            </Box>
          )}
        </Grid>
        {localStorageToken ? (
          <Grid item md={3} xs={12} backgroundColor="#E9F5E1">
            <Cart products={products} items={cart} handleQuantity={addToCart} />
          </Grid>
        ) : (
          ""
        )}
      </Grid>

      <Footer />
    </div>
  );
}
